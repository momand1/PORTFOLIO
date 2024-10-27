"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaVuejs,
  FaDatabase,
  FaDocker,
  FaSass,
  FaBootstrap,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";
import { SiTypescript, SiTailwindcss } from "react-icons/si";

// Skills and projects data
const skills = [
  { name: "HTML", icon: FaHtml5, color: "#E34F26" },
  { name: "CSS", icon: FaCss3Alt, color: "#1572B6" },
  { name: "JavaScript", icon: FaJs, color: "#F7DF1E" },
  { name: "Vue.js", icon: FaVuejs, color: "#4FC08D" },
  { name: "SQL", icon: FaDatabase, color: "#00758F" },
  { name: "NoSQL", icon: FaDatabase, color: "#4DB33D" },
  { name: "SCSS", icon: FaSass, color: "#CC6699" },
  { name: "Bootstrap", icon: FaBootstrap, color: "#7952B3" },
  { name: "Docker", icon: FaDocker, color: "#2496ED" },
  { name: "UI/UX", icon: SiTailwindcss, color: "#38B2AC" },
  { name: "Scrum", icon: SiTypescript, color: "#3178C6" },
];

const projects = [
  {
    id: 1,
    name: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with VueJS 3",
    url: "https://web-wares.vercel.app/",
    image: "webwares.png",
  },
  {
    id: 2,
    name: "Front-end Styling",
    description: "Using HTML, CSS, SASS, Bootstrap",
    url: "https://front-style.vercel.app",
    image: "front.png",
  },
];

// Wormhole animation component
const Wormhole = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  useEffect(() => {
    camera.position.z = 5;
  }, [camera]);

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 6, 32, 1, true]} />
      <shaderMaterial
        side={THREE.DoubleSide}
        transparent={true}
        uniforms={{ time: { value: 0 } }}
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
            float intensity = 1.0 / (r * 0.5 + 0.5);
            vec3 color = vec3(0.5, 0.2, 1.0) * intensity * smoothstep(0.0, 1.0, 1.0 - r);
            gl_FragColor = vec4(color, 1.0 - r);
          }
        `}
      />
    </mesh>
  );
};

// Skill card component
type Skill = {
  name: string;
  icon: React.ElementType;
  color: string;
};
const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => {
  return (
    <motion.div
      className="absolute top-1/2 transform -translate-y-1/2"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        width: "200px",
        height: "120px",
        backgroundColor: skill.color,
        borderRadius: "10px",
        padding: "10px",
        color: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <skill.icon size={40} />
      <div className="text-lg font-bold mt-2">{skill.name}</div>
    </motion.div>
  );
};

// Main Portfolio component
export default function Portfolio() {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkillIndex((prevIndex) => (prevIndex + 1) % skills.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleScroll = () => {
    const sections = ["home", "about", "skills", "projects", "contact"];
    const currentSection = sections.find((section) => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      }
      return false;
    });
    if (currentSection) {
      setActiveSection(currentSection);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-10 bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-500">ShirDev</div>

          {/* Burger Icon */}
          <div
            className="flex lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div
              className={`space-y-1 cursor-pointer transform transition ${
                menuOpen ? "rotate-45" : ""
              }`}
            >
              <span
                className={`block w-8 h-0.5 bg-white transition transform ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block w-8 h-0.5 bg-white transition ${
                  menuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-8 h-0.5 bg-white transition transform ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </div>

          {/* Menu */}
          <ul
            className={`lg:flex lg:space-x-6 lg:static fixed top-16 right-0 bg-black bg-opacity-50 lg:bg-transparent w-full lg:w-auto space-y-6 lg:space-y-0 lg:items-center p-6 lg:p-0 transition-all transform ${
              menuOpen ? "translate-x-0" : "translate-x-full"
            } lg:translate-x-0`}
          >
            {["home", "about", "skills", "projects", "contact"].map(
              (section) => (
                <li key={section}>
                  <button
                    onClick={() => scrollToSection(section)}
                    className={`text-gray-400 hover:text-white transition-colors ${
                      activeSection === section ? "text-white" : ""
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </header>

      <main>
        {/* Home Section */}
        <section id="home" className="h-screen relative overflow-hidden">
          <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Wormhole />
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={1}
            />
          </Canvas>
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <div className="relative w-full h-32 mb-16">
              <AnimatePresence>
                <SkillCard
                  key={skills[currentSkillIndex].name}
                  skill={skills[currentSkillIndex]}
                />
              </AnimatePresence>
            </div>
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4">Shir Shah Momand</h1>
              <p className="text-2xl text-gray-400 mb-8">
                Full Stack Developer
              </p>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
                Creating User-Friendly Web Applications with Passion and
                Creativity{" "}
              </p>
              <button
                onClick={() => scrollToSection("projects")}
                className="bg-purple-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-700 transition-colors"
              >
                View My Projects
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className="py-20"
          style={{
            backgroundColor: "#000000",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Cg fill-opacity='0.45'%3E%3Ccircle fill='%23000000' cx='400' cy='400' r='600'/%3E%3Ccircle fill='%23230046' cx='400' cy='400' r='500'/%3E%3Ccircle fill='%232f0052' cx='400' cy='400' r='400'/%3E%3Ccircle fill='%233b075e' cx='400' cy='400' r='300'/%3E%3Ccircle fill='%2348156a' cx='400' cy='400' r='200'/%3E%3Ccircle fill='%23552277' cx='400' cy='400' r='100'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundAttachment: window.innerWidth < 768 ? "scroll" : "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-8 text-center text-white">
              About Me
            </h2>
            <p className="text-lg max-w-2xl mx-auto text-center text-white">
              I am a motivated Full Stack Developer with a strong foundation in
              web development. I enjoy tackling challenges and continuously
              learning new technologies to build comprehensive solutions that
              meet user needs.
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">My Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex flex-col items-center p-6 bg-gray-800 rounded-lg shadow-lg"
                >
                  <skill.icon
                    className="text-5xl mb-4"
                    style={{ color: skill.color }}
                  />
                  <span className="text-lg font-semibold">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                >
                  <img
                    src={`/images/${project.image}`}
                    alt={project.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Learn More →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}

        <section
          id="contact"
          className="h-screen flex flex-col items-center justify-center"
        >
          <h2 className="text-4xl font-bold mb-10">Contact</h2>
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/in/shir-shah-momand-a35b512bb"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin
                size={40}
                className="text-blue-600 hover:text-blue-400 transition"
              />
            </a>
            <a href="mailto:shir_momand@yahoo.com">
              <FaEnvelope
                size={40}
                className="text-red-600 hover:text-red-400 transition"
              />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2024 Shir Shah Momand. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
