export type Page = 'home' | 'workshops' | 'speakers' | 'partners' | 'login' | 'register-page' | 'dashboard' | 'workshop-detail';

export interface Speaker {
  id?: number;
  name: string;
  role: string;
  bio: string;
  specialty?: string;
}

export interface Workshop {
  id: number;
  title: string;
  description: string;
  date?: string;
  duration?: string;
  attendance_type?: string;
  sessions_count?: number;
  speaker_initials?: string;
  speakers?: (Speaker | string)[];
}

export interface Partner {
  id?: number;
  name: string;
  description: string;
  website?: string;
}

export interface Registration {
  id?: number;
  full_name: string;
  email: string;
  phone_number: string;
  field_of_study: string;
  attendance_type: string;
  workshop: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export const MOCK_WORKSHOPS: Workshop[] = [
  { id:1, title:'AI & Machine Learning Bootcamp', description:'Dive into the world of artificial intelligence and machine learning with hands-on sessions. Learn about neural networks, model training, and real-world applications.', date:'2025-06-15', duration:'3h', attendance_type:'on-site online', sessions_count:3, speaker_initials:'AS', speakers: ['Ahmed Saadaoui'] },
  { id:2, title:'Full Stack Web Development with Django & React', description:'Build production-ready web applications from scratch. Cover backend APIs with Django REST Framework and modern frontend with React.', date:'2025-06-22', duration:'4h', attendance_type:'on-site', sessions_count:4, speaker_initials:'MB', speakers: ['Meriem Boudjema'] },
  { id:3, title:'Cybersecurity Fundamentals', description:'Learn the foundations of cybersecurity including penetration testing, network security, and ethical hacking techniques used by professionals.', date:'2025-07-05', duration:'2h30', attendance_type:'online', sessions_count:2, speaker_initials:'KZ', speakers: ['Karim Zouaoui'] },
  { id:4, title:'Mobile App Development with Flutter', description:'Create beautiful cross-platform mobile apps for iOS and Android using Google\'s Flutter framework and Dart programming language.', date:'2025-07-12', duration:'3h30', attendance_type:'on-site online', sessions_count:3, speaker_initials:'LB', speakers: ['Lydia Boudjenane'] },
  { id:5, title:'DevOps & Cloud Infrastructure', description:'Master modern DevOps practices including CI/CD pipelines, Docker containers, Kubernetes orchestration, and cloud deployment on AWS.', date:'2025-07-19', duration:'3h', attendance_type:'online', sessions_count:3, speaker_initials:'RH', speakers: ['Ramy Hamzaoui'] },
  { id:6, title:'UI/UX Design for Developers', description:'Bridge the gap between design and development. Learn Figma, design systems, user research, and how to create exceptional user experiences.', date:'2025-07-26', duration:'2h', attendance_type:'on-site', sessions_count:2, speaker_initials:'SM', speakers: ['Sara Mammeri'] },
];

export const MOCK_SPEAKERS: Speaker[] = [
  { name:'Ahmed Saadaoui', role:'AI Research Engineer', bio:'Expert in machine learning and deep learning with 8+ years of experience at leading tech companies. Published researcher.' },
  { name:'Meriem Boudjema', role:'Full Stack Developer', bio:'Senior developer specializing in Django and React ecosystems. Open source contributor and tech educator.' },
  { name:'Karim Zouaoui', role:'Cybersecurity Specialist', bio:'Certified ethical hacker and security consultant. Helped 50+ organizations strengthen their security posture.' },
  { name:'Lydia Boudjenane', role:'Mobile Developer', bio:'Flutter and mobile development expert. Built apps with 1M+ downloads. Google Developer Expert.' },
  { name:'Ramy Hamzaoui', role:'DevOps Architect', bio:'Cloud infrastructure specialist with deep expertise in AWS, Azure, and GCP. Kubernetes certified administrator.' },
  { name:'Sara Mammeri', role:'UX/UI Designer', bio:'Product designer with a passion for user-centered design. Previously at Jumia, Yassir, and top design studios.' },
];

export const MOCK_PARTNERS: Partner[] = [
  { name:'Octenium', description:'Leading technology solutions provider in Algeria. Supporting tech education and developer communities across the country.' },
  { name:'Setif University', description:'Premier technical university in eastern Algeria. Partner for academic workshops and research collaboration.' },
  { name:'Microsoft Algeria', description:'Technology giant supporting digital transformation and developer empowerment in Algeria.' },
  { name:'Google Developers', description:'Supporting developer communities through resources, tools, and community programs.' },
  { name:'Djezzy Tech', description:'Telecommunications partner providing connectivity infrastructure and technical resources.' },
  { name:'Ooredoo Algeria', description:'Digital services partner supporting innovation and tech entrepreneurship.' },
];
