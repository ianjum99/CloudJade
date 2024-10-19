const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const winston = require('winston');
const expressWinston = require('express-winston');
const AWS = require('aws-sdk');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const app = express();
const port = process.env.PORT || 3001;

// AWS Configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'cloudjade-ide' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false
}));

// Input validation middleware
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User registration
app.post('/api/register', 
  validate([
    body('username').isLength({ min: 5 }).trim().escape(),
    body('password').isLength({ min: 8 })
  ]),
  async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = { 
        id: uuidv4(), 
        username: req.body.username, 
        password: hashedPassword,
        twoFactorSecret: speakeasy.generateSecret({ length: 32 })
      };

      const params = {
        TableName: 'Users',
        Item: user
      };

      await dynamoDB.put(params).promise();

      const qrCodeUrl = await qrcode.toDataURL(user.twoFactorSecret.otpauth_url);

      res.status(201).json({ 
        message: 'User registered successfully',
        qrCode: qrCodeUrl
      });
    } catch (error) {
      logger.error('Error registering user:', error);
      res.status(500).send('Error registering user');
    }
  }
);

// User login
app.post('/api/login', 
  validate([
    body('username').isLength({ min: 5 }).trim().escape(),
    body('password').isLength({ min: 8 }),
    body('token').optional().isLength({ min: 6, max: 6 }).isNumeric()
  ]),
  async (req, res) => {
    try {
      const params = {
        TableName: 'Users',
        Key: {
          username: req.body.username
        }
      };

      const result = await dynamoDB.get(params).promise();
      const user = result.Item;

      if (!user) {
        return res.status(400).send('Cannot find user');
      }

      if (await bcrypt.compare(req.body.password, user.password)) {
        if (user.twoFactorEnabled) {
          if (!req.body.token) {
            return res.status(400).send('Two-factor authentication token required');
          }

          const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret.base32,
            encoding: 'base32',
            token: req.body.token
          });

          if (!verified) {
            return res.status(400).send('Invalid two-factor authentication token');
          }
        }

        const accessToken = jwt.sign(user, process.env.JWT_SECRET);
        res.json({ accessToken: accessToken });
      } else {
        res.send('Not Allowed');
      }
    } catch (error) {
      logger.error('Error logging in:', error);
      res.status(500).send('Error logging in');
    }
  }
);

// Enable two-factor authentication
app.post('/api/enable-2fa', authenticateToken, async (req, res) => {
  try {
    const params = {
      TableName: 'Users',
      Key: { id: req.user.id },
      UpdateExpression: 'set twoFactorEnabled = :enabled',
      ExpressionAttributeValues: {
        ':enabled': true
      },
      ReturnValues: 'UPDATED_NEW'
    };

    await dynamoDB.update(params).promise();
    res.json({ status: 'Two-factor authentication enabled' });
  } catch (error) {
    logger.error('Error enabling 2FA:', error);
    res.status(500).send('Error enabling two-factor authentication');
  }
});

// Get plugins
app.get('/api/plugins', authenticateToken, async (req, res) => {
  try {
    const params = {
      TableName: 'Plugins'
    };

    const result = await dynamoDB.scan(params).promise();
    res.json(result.Items);
  } catch (error) {
    logger.error('Error fetching plugins:', error);
    res.status(500).send('Error fetching plugins');
  }
});

// Toggle plugin installation
app.post('/api/plugins/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const params = {
      TableName: 'Plugins',
      Key: { id: req.params.id },
      UpdateExpression: 'set installed = :installed',
      ExpressionAttributeValues: {
        ':installed': true // You might want to toggle this based on current state
      },
      ReturnValues: 'UPDATED_NEW'
    };

    const result = await dynamoDB.update(params).promise();
    res.json(result.Attributes);
  } catch (error) {
    logger.error('Error toggling plugin:', error);
    res.status(500).send('Error toggling plugin');
  }
});

// Save project
app.post('/api/projects', 
  authenticateToken,
  validate([
    body('name').isLength({ min: 1 }).trim().escape(),
    body('code').isLength({ min: 1 })
  ]),
  async (req, res) => {
    try {
      const project = { 
        id: uuidv4(), 
        name: req.body.name, 
        userId: req.user.id, 
        code: req.body.code 
      };

      const params = {
        TableName: 'Projects',
        Item: project
      };

      await dynamoDB.put(params).promise();
      res.status(201).json(project);
    } catch (error) {
      logger.error('Error saving project:', error);
      res.status(500).send('Error saving project');
    }
  }
);

// Get user's projects
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const params = {
      TableName: 'Projects',
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': req.user.id
      }
    };

    const result = await dynamoDB.scan(params).promise();
    res.json(result.Items);
  } catch (error) {
    logger.error('Error fetching projects:', error);
    res.status(500).send('Error fetching projects');
  }
});

// Upload file
app.post('/api/files', 
  authenticateToken,
  validate([
    body('name').isLength({ min: 1 }).trim().escape(),
    body('content').isLength({ min: 1 })
  ]),
  async (req, res) => {
    try {
      const file = { 
        id: uuidv4(), 
        name: req.body.name, 
        userId: req.user.id
      };

      const s3Params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${req.user.id}/${file.id}`,
        Body: req.body.content
      };

      await s3.upload(s3Params).promise();

      const dynamoParams = {
        TableName: 'Files',
        Item: file
      };

      await dynamoDB.put(dynamoParams).promise();
      res.status(201).json(file);
    } catch (error) {
      logger.error('Error uploading file:', error);
      res.status(500).send('Error uploading file');
    }
  }
);

// Get user's files
app.get('/api/files', authenticateToken, async (req, res) => {
  try {
    const params = {
      TableName: 'Files',
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': req.user.id
      }
    };

    const result = await dynamoDB.scan(params).promise();
    res.json(result.Items);
  } catch (error) {
    logger.error('Error fetching files:', error);
    res.status(500).send('Error fetching files');
  }
});

// Execute code (using AWS ECS)
app.post('/api/execute', 
  authenticateToken,
  validate([
    body('code').isLength({ min: 1 }),
    body('language').isIn(['java', 'python', 'javascript'])
  ]),
  async (req, res) => {
    try {
      const ecs = new AWS.ECS();
      const params = {
        cluster: process.env.ECS_CLUSTER_NAME,
        taskDefinition: process.env.ECS_TASK_DEFINITION,
        launchType: 'FARGATE',
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: [process.env.ECS_SUBNET],
            securityGroups: [process.env.ECS_SECURITY_GROUP],
            assignPublicIp: 'ENABLED'
          }
        },
        overrides: {
          containerOverrides: [
            {
              name: 'code-execution-container',
              environment: [
                {
                  name: 'CODE',
                  value: req.body.code
                },
                {
                  name: 'LANGUAGE',
                  value: req.body.language
                }
              ]
            }
          ]
        }
      };

      const result = await ecs.runTask(params).promise();
      res.json({ taskArn: result.tasks[0].taskArn });
    } catch (error) {
      logger.error('Error executing code:', error);
      res.status(500).send('Error executing code');
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Use HTTPS
const https = require('https');
const fs = require('fs');

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});