'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { FaHtml5, FaCss3Alt, FaJs, FaVuejs, FaDatabase, FaDocker, FaSass, FaBootstrap } from 'react-icons/fa'
import { SiTypescript, SiTailwindcss } from 'react-icons/si'

const skills = [
  { name: 'HTML', icon: FaHtml5, color: '#E34F26' },
  { name: 'CSS', icon: FaCss3Alt, color: '#1572B6' },
  { name: 'JavaScript', icon: FaJs, color: '#F7DF1E' },
  { name: 'Vue.js', icon: FaVuejs, color: '#4FC08D' },
  { name: 'SQL', icon: FaDatabase, color: '#00758F' },
  { name: 'NoSQL', icon: FaDatabase, color: '#4DB33D' },
  { name: 'SCSS', icon: FaSass, color: '#CC6699' },
  { name: 'Bootstrap', icon: FaBootstrap, color: '#7952B3' },
  { name: 'Docker', icon: FaDocker, color: '#2496ED' },
  { name: 'UI/UX', icon: SiTailwindcss, color: '#38B2AC' },
  { name: 'Scrum', icon: SiTypescript, color: '#3178C6' },
]

const projects = [
  { id: 1, name: 'E-commerce Platform', description: 'A full-stack e-commerce solution with React and Node.js' },
  { id: 2, name: 'Task Management App', description: 'A Vue.js based task management application with real-time updates' },
  { id: 3, name: 'Data Visualization Dashboard', description: 'An interactive dashboard using D3.js for complex data visualization' },
]

const Wormhole = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree()

  useFrame((state) => {
    if (meshRef.current) { // Ensure meshRef.current is not null
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }  })

  useEffect(() => {
    camera.position.z = 5
  }, [camera])

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 4, 32, 1, true]} />
      <shaderMaterial
        side={THREE.DoubleSide}
        transparent={true}
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv * 2.0 - 1.0;
            float r = length(p);
            float angle = atan(p.y, p.x);
            float intensity = 0.5 / (r * 2.0 + 0.5);
            vec3 color = vec3(0.5, 0.2, 1.0) * intensity;
            gl_FragColor = vec4(color, 1.0 - r);
          }
        `}
      />
    </mesh>
  )
}

const SkillCard = ({ skill }) => {
  return (
    <motion.div
      className="absolute top-1/2 transform -translate-y-1/2"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        width: '200px',
        height: '120px',
        backgroundColor: skill.color,
        borderRadius: '10px',
        padding: '10px',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <skill.icon size={40} />
      <div className="text-lg font-bold mt-2">{skill.name}</div>
    </motion.div>
  )
}

export default function Portfolio() {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [activeSection, setActiveSection] = useState('home')
  const [formStatus, setFormStatus] = ('')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkillIndex((prevIndex) => (prevIndex + 1) % skills.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleScroll = () => {
    const sections = ['home', 'about', 'skills', 'projects', 'contact']
    const currentSection = sections.find(section => {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      }
      return false
    })
    if (currentSection) {
      setActiveSection(currentSection)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormStatus('sending')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
  
      if (response.ok) {
        setFormStatus('')
        // alert('Thank you for your message! I will get back to you soon.')
        e.currentTarget.reset()
      } else {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        setFormStatus('error')
        // throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Sorry, there was an error sending your message. Please try again later.')
      setFormStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-purple-500">ShirDev</div>
            <ul className="flex space-x-6">
              {['home', 'about', 'skills', 'projects', 'contact'].map((section) => (
                <li key={section}>
                  <button
                    onClick={() => scrollToSection(section)}
                    className={`text-gray-400 hover:text-white transition-colors ${activeSection === section ? 'text-white' : ''}`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="h-screen relative overflow-hidden">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Wormhole />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </Canvas>
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <div className="relative w-full h-32 mb-16">
              <AnimatePresence>
                <SkillCard key={skills[currentSkillIndex].name} skill={skills[currentSkillIndex]} />
              </AnimatePresence>
            </div>
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4">Shir Shah Momand</h1>
              <p className="text-2xl text-gray-400 mb-8">Full Stack Developer</p>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              Creating User-Friendly Web Applications with Passion and Creativity              </p>
              <button
                onClick={() => scrollToSection('projects')}
                className="bg-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors"
              >
                View My Projects
              </button>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-8 text-center">About Me</h2>
            <p className="text-lg max-w-2xl mx-auto text-center">
            I am a motivated Full Stack Developer with a strong foundation in web development gained through an intensive bootcamp. I am passionate about creating beautiful, efficient, and user-friendly web applications. I enjoy tackling challenges and continuously learning new technologies to build comprehensive solutions that meet user needs.
            </p>
          </div>
        </section>

        <section id="skills" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">My Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {skills.map((skill) => (
                <div key={skill.name} className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg">
                  <skill.icon className="text-5xl mb-4" style={{ color: skill.color }} />
                  <span className="text-lg font-semibold">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <img src={`/placeholder.svg?height=200&width=400`} alt={project.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <button
                      onClick={() => alert(`Viewing details for ${project.name}`)}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Learn More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">Get In Touch</h2>
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input type="text" id="name" name="name" required className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" id="email" name="email" required className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea id="message" name="message" rows={4} required className="w-full px-3 py-2 bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                </div>
                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors" disabled={formStatus === 'sending'}>
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {formStatus === 'success' && (
                  <p className="text-green-500 text-center">Thank you for your message! I will get back to you soon.</p>
                )}
                {formStatus === 'error' && (
                  <p className="text-red-500 text-center">Sorry, there was an error sending your message. Please try again later. </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 Shir Shah Momand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}