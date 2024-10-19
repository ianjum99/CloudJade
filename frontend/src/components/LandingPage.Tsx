import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { CheckIcon, CodeIcon, CloudIcon, ZapIcon } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#3A405A] text-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#50C878]">CloudJade IDE</h1>
          <div className="space-x-4">
            <Button variant="ghost" className="text-white hover:text-[#96C5F7]">Features</Button>
            <Button variant="ghost" className="text-white hover:text-[#96C5F7]">Pricing</Button>
            <Button variant="outline" className="text-[#3A405A] border-white hover:bg-[#96C5F7] hover:text-white">Login</Button>
            <Button className="bg-[#50C878] text-[#3A405A] hover:bg-[#96C5F7]">Sign Up</Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <motion.h2 
            className="text-5xl font-bold mb-6 text-[#50C878]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to CloudJade IDE
          </motion.h2>
          <motion.p 
            className="text-xl mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            A powerful, web-based Java IDE that runs in your browser
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button size="lg" className="mr-4 bg-[#50C878] hover:bg-[#96C5F7] text-[#3A405A]">Get Started</Button>
            <Button size="lg" variant="outline" className="text-[#3A405A] border-white hover:bg-[#96C5F7] hover:text-white">Learn More</Button>
          </motion.div>
        </section>

        <section className="py-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#50C878]">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<CodeIcon className="h-12 w-12 mb-4 text-[#50C878]" />}
              title="In-Browser Java Execution"
              description="Run Java code directly in your browser using CheerpJ technology."
            />
            <FeatureCard 
              icon={<ZapIcon className="h-12 w-12 mb-4 text-[#50C878]" />}
              title="Lightning Fast"
              description="Experience rapid code execution and responsive UI for seamless development."
            />
            <FeatureCard 
              icon={<CloudIcon className="h-12 w-12 mb-4 text-[#50C878]" />}
              title="Cloud Storage"
              description="Store your projects and files securely in the cloud (Premium feature)."
            />
          </div>
        </section>

        <section className="py-20">
          <h3 className="text-3xl font-bold text-center mb-12 text-[#50C878]">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard 
              title="Free Tier"
              price="$0"
              features={[
                "In-browser Java execution",
                "Basic code completion",
                "Limited computing resources",
              ]}
              buttonText="Get Started"
            />
            <PricingCard 
              title="Premium Tier"
              price="$9.99"
              period="/month"
              features={[
                "All Free Tier features",
                "Project storage",
                "File upload and management",
                "Enhanced computing power",
                "Priority support",
              ]}
              buttonText="Upgrade Now"
              highlighted={true}
            />
          </div>
        </section>
      </main>

      <footer className="bg-[#3A405A] py-8 mt-20 border-t border-[#96C5F7]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2023 CloudJade IDE. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#96C5F7]">Terms of Service</a>
              <a href="#" className="hover:text-[#96C5F7]">Privacy Policy</a>
              <a href="#" className="hover:text-[#96C5F7]">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="bg-[#3A405A] border-[#50C878] border">
      <CardHeader>
        <CardTitle className="flex flex-col items-center text-[#50C878]">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-white">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function PricingCard({ title, price, period = '', features, buttonText, highlighted = false }) {
  return (
    <Card className={`${highlighted ? 'border-2 border-[#50C878]' : 'border border-[#96C5F7]'} bg-[#3A405A]`}>
      <CardHeader>
        <CardTitle className="text-2xl text-[#50C878]">{title}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold text-white">{price}</span>
          {period && <span className="text-xl text-[#96C5F7]">{period}</span>}
        
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="h-5 w-5 mr-2 text-[#50C878]" />
              <span className="text-white">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={highlighted ? 'default' : 'outline'}
          style={{
            backgroundColor: highlighted ? '#50C878' : 'white',
            borderColor: highlighted ? '#50C878' : '#96C5F7',
            color: '#3A405A'
          }}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}