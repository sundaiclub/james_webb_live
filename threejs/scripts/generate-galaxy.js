import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Particle {
  position: [number, number, number];
  velocity: [number, number, number];
  color: [number, number, number];
  mass: number;
  type: 'star' | 'particle';
}

function generateGalaxy(numStars = 10, numParticles = 5000): { particles: Particle[] } {
  const particles: Particle[] = [];
  
  // Generate massive stars first
  for (let i = 0; i < numStars; i++) {
    const radius = Math.random() * 8;
    const angle = (i / numStars) * Math.PI * 2;
    const armOffset = Math.floor(i % 3) * (Math.PI * 2 / 3);
    const spiralAngle = angle + (radius * 0.5) + armOffset;
    
    const x = Math.cos(spiralAngle) * radius;
    const z = Math.sin(spiralAngle) * radius;
    const y = (Math.random() - 0.5) * 0.2;
    
    const star: Particle = {
      position: [Number(x.toFixed(3)), Number(y.toFixed(3)), Number(z.toFixed(3))],
      velocity: [0, 0, 0],
      color: [1, 0.8, 0.4],
      mass: 100 + Math.random() * 200,
      type: 'star'
    };
    particles.push(star);
  }

  // Generate light particles
  for (let i = 0; i < numParticles; i++) {
    const radius = Math.random() * 10;
    const angle = Math.random() * Math.PI * 2;
    const nearestStar = Math.floor(Math.random() * numStars);
    const starPos = particles[nearestStar].position;
    
    const armOffset = Math.floor(Math.random() * 3) * (Math.PI * 2 / 3);
    const spiralAngle = angle + (radius * 2) + armOffset;
    
    const x = Math.cos(spiralAngle) * radius + starPos[0] * 0.3;
    const z = Math.sin(spiralAngle) * radius + starPos[2] * 0.3;
    const y = (Math.random() - 0.5) * 0.5;
    
    const distanceFromCenter = Math.sqrt(x * x + z * z);
    const orbitalSpeed = 0.002 / Math.sqrt(Math.max(0.1, distanceFromCenter));
    const tangentialAngle = Math.atan2(z, x) + Math.PI / 2;
    
    // Color calculation based on radius and arm
    const normalizedRadius = radius / 10;
    const armIndex = Math.floor((spiralAngle / (Math.PI * 2)) * 3);
    
    let color: [number, number, number];
    switch(armIndex % 3) {
      case 0:
        color = [0.5 + normalizedRadius * 0.5, 0.5 + normalizedRadius * 0.5, 0.8 + normalizedRadius * 0.2];
        break;
      case 1:
        color = [0.8 + normalizedRadius * 0.2, 0.4 + normalizedRadius * 0.4, 0.3 + normalizedRadius * 0.2];
        break;
      default:
        color = [0.6 + normalizedRadius * 0.4, 0.3 + normalizedRadius * 0.4, 0.7 + normalizedRadius * 0.3];
    }
    
    const particle: Particle = {
      position: [Number(x.toFixed(3)), Number(y.toFixed(3)), Number(z.toFixed(3))],
      velocity: [
        Number((Math.cos(tangentialAngle) * orbitalSpeed).toFixed(6)), 
        0, 
        Number((Math.sin(tangentialAngle) * orbitalSpeed).toFixed(6))
      ],
      color: color.map(c => Number(Math.min(1, c).toFixed(3))) as [number, number, number],
      mass: 0.1,
      type: 'particle'
    };
    particles.push(particle);
  }

  return { particles };
}

const outputPath = join(dirname(__dirname), 'public', 'initial_galaxy.json');
const galaxyData = generateGalaxy();
writeFileSync(outputPath, JSON.stringify(galaxyData, null, 2));