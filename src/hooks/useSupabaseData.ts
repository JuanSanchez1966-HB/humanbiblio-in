import { useState, useEffect } from 'react';
import { supabase, isDemoMode } from '../lib/supabase';
import type { User, Business } from '../types';

// Datos mock para desarrollo mientras configuramos Supabase
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'ana@example.com',
    full_name: 'Ana García',
    profession: 'Psicóloga Clínica',
    profession_en: 'Clinical Psychologist',
    bio: 'Especialista en terapia cognitivo-conductual con más de 10 años de experiencia. Me apasiona ayudar a las personas a superar sus desafíos emocionales.',
    bio_en: 'Specialist in cognitive-behavioral therapy with over 10 years of experience. Passionate about helping people overcome their emotional challenges.',
    interests: ['psicología', 'mindfulness', 'bienestar mental', 'terapia'],
    interests_en: ['psychology', 'mindfulness', 'mental wellness', 'therapy'],
    location: 'Madrid, España',
    country: 'España',
    country_flag: '🇪🇸',
    native_language: 'Español',
    languages_spoken: ['Español', 'Inglés', 'Francés'],
    avatar_url: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: new Date().toISOString(),
    is_wb_seller: true,
    wb_profile_id: 'wb-1',
    wb_subscription_active: true
  },
  {
    id: '2',
    email: 'carlos@example.com',
    full_name: 'Carlos Rodríguez',
    profession: 'Desarrollador Full Stack',
    profession_en: 'Full Stack Developer',
    bio: 'Desarrollador apasionado por crear soluciones tecnológicas innovadoras. Especializado en React, Node.js y arquitecturas escalables.',
    bio_en: 'Developer passionate about creating innovative technological solutions. Specialized in React, Node.js and scalable architectures.',
    interests: ['programación', 'javascript', 'react', 'node.js', 'tecnología'],
    interests_en: ['programming', 'javascript', 'react', 'node.js', 'technology'],
    location: 'Barcelona, España',
    country: 'España',
    country_flag: '🇪🇸',
    native_language: 'Español',
    languages_spoken: ['Español', 'Inglés', 'Catalán'],
    avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: new Date().toISOString(),
    is_wb_seller: true,
    wb_profile_id: 'wb-2',
    wb_subscription_active: true
  },
  {
    id: '3',
    email: 'maria@example.com',
    full_name: 'María Santos',
    profession: 'Chef Ejecutiva',
    profession_en: 'Executive Chef',
    bio: 'Chef con experiencia internacional, especializada en cocina mediterránea y fusión. Me encanta experimentar con sabores únicos.',
    bio_en: 'Chef with international experience, specialized in Mediterranean and fusion cuisine. Love experimenting with unique flavors.',
    interests: ['cocina', 'gastronomía', 'nutrición', 'creatividad culinaria'],
    interests_en: ['cooking', 'gastronomy', 'nutrition', 'culinary creativity'],
    location: 'Valencia, España',
    country: 'España',
    country_flag: '🇪🇸',
    native_language: 'Español',
    languages_spoken: ['Español', 'Inglés', 'Italiano'],
    avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: new Date().toISOString(),
    is_wb_seller: true,
    wb_profile_id: 'wb-3',
    wb_subscription_active: true
  },
  {
    id: '4',
    email: 'david@example.com',
    full_name: 'David Martínez',
    profession: 'Músico y Productor',
    profession_en: 'Musician and Producer',
    bio: 'Músico profesional con más de 15 años de experiencia. Especializado en producción musical y composición para medios audiovisuales.',
    bio_en: 'Professional musician with over 15 years of experience. Specialized in music production and composition for audiovisual media.',
    interests: ['música', 'composición', 'producción musical', 'audio', 'creatividad'],
    interests_en: ['music', 'composition', 'music production', 'audio', 'creativity'],
    location: 'Sevilla, España',
    country: 'España',
    country_flag: '🇪🇸',
    native_language: 'Español',
    languages_spoken: ['Español', 'Inglés', 'Portugués'],
    avatar_url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: new Date().toISOString(),
    is_wb_seller: true,
    wb_profile_id: 'wb-4',
    wb_subscription_active: true
  },
  {
    id: '5',
    email: 'lucia@example.com',
    full_name: 'Lucía Fernández',
    profession: 'Diseñadora UX/UI',
    profession_en: 'UX/UI Designer',
    bio: 'Diseñadora especializada en experiencias digitales centradas en el usuario. Me apasiona crear interfaces intuitivas y accesibles.',
    bio_en: 'Designer specialized in user-centered digital experiences. Passionate about creating intuitive and accessible interfaces.',
    interests: ['diseño', 'UX', 'UI', 'prototipado', 'investigación de usuarios'],
    interests_en: ['design', 'UX', 'UI', 'prototyping', 'user research'],
    location: 'Bilbao, España',
    country: 'España',
    country_flag: '🇪🇸',
    native_language: 'Español',
    languages_spoken: ['Español', 'Inglés', 'Euskera'],
    avatar_url: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: new Date().toISOString(),
    is_wb_seller: true,
    wb_profile_id: null,
    wb_subscription_active: false
  }
];

const MOCK_BUSINESSES: Business[] = [
  {
    id: 'wb-ana-garcia',
    name: 'Terapia Integral Ana García',
    name_en: 'Ana García Integral Therapy',
    category: 'Salud y Bienestar',
    category_en: 'Health & Wellness',
    description: 'Servicios de psicología clínica especializada en terapia cognitivo-conductual, mindfulness y bienestar emocional. Consultas presenciales y online con más de 10 años de experiencia.',
    description_en: 'Clinical psychology services specialized in cognitive-behavioral therapy, mindfulness and emotional well-being. In-person and online consultations with over 10 years of experience.',
    products_services: ['Terapia Individual', 'Terapia de Pareja', 'Sesiones de Mindfulness', 'Consultas Online', 'Talleres Grupales'],
    products_services_en: ['Individual Therapy', 'Couples Therapy', 'Mindfulness Sessions', 'Online Consultations', 'Group Workshops'],
    owner_id: '1',
    contact_email: 'ana@terapiaintegral.com',
    contact_phone: '+34 600 123 456',
    website: 'https://terapiaintegral.com',
    location: 'Madrid, España',
    avatar_url: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date().toISOString(),
    subscription_tier: 'premium',
    is_featured: true
  },
  {
    id: 'wb-carlos-rodriguez',
    name: 'TechSolutions Carlos Rodríguez',
    name_en: 'Carlos Rodríguez TechSolutions',
    category: 'Tecnología',
    category_en: 'Technology',
    description: 'Desarrollo de aplicaciones web y móviles de alta calidad. Consultoría tecnológica especializada en React, Node.js y arquitecturas escalables para startups y empresas.',
    description_en: 'High-quality web and mobile application development. Technology consulting specialized in React, Node.js and scalable architectures for startups and businesses.',
    products_services: ['Desarrollo Web', 'Apps Móviles', 'Consultoría IT', 'Automatización', 'E-commerce'],
    products_services_en: ['Web Development', 'Mobile Apps', 'IT Consulting', 'Automation', 'E-commerce'],
    owner_id: '2',
    contact_email: 'carlos@techsolutions.com',
    contact_phone: '+34 600 234 567',
    website: 'https://techsolutions-carlos.com',
    location: 'Barcelona, España',
    avatar_url: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date().toISOString(),
    subscription_tier: 'enterprise',
    is_featured: true
  },
  {
    id: 'wb-maria-santos',
    name: 'Cocina Creativa María Santos',
    name_en: 'María Santos Creative Kitchen',
    category: 'Gastronomía',
    category_en: 'Gastronomy',
    description: 'Chef ejecutiva especializada en cocina mediterránea y fusión. Servicios de catering, clases de cocina y consultoría gastronómica para restaurantes.',
    description_en: 'Executive chef specialized in Mediterranean and fusion cuisine. Catering services, cooking classes and gastronomic consulting for restaurants.',
    products_services: ['Catering Eventos', 'Clases de Cocina', 'Consultoría Gastronómica', 'Menús Personalizados', 'Cocina Saludable'],
    products_services_en: ['Event Catering', 'Cooking Classes', 'Gastronomic Consulting', 'Customized Menus', 'Healthy Cuisine'],
    owner_id: '3',
    contact_email: 'maria@cocinacreativa.com',
    contact_phone: '+34 600 345 678',
    website: 'https://cocinacreativa-maria.com',
    location: 'Valencia, España',
    avatar_url: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date().toISOString(),
    subscription_tier: 'premium',
    is_featured: true
  },
  {
    id: 'wb-david-martinez',
    name: 'Sonidos del Sur - David Martínez',
    name_en: 'Southern Sounds - David Martínez',
    category: 'Música y Audio',
    category_en: 'Music & Audio',
    description: 'Estudio de grabación y producción musical profesional. Servicios completos para artistas, podcasts y proyectos audiovisuales con más de 15 años de experiencia.',
    description_en: 'Professional recording and music production studio. Complete services for artists, podcasts and audiovisual projects with over 15 years of experience.',
    products_services: ['Grabación Profesional', 'Producción Musical', 'Mezcla y Masterización', 'Composición', 'Audio para Video'],
    products_services_en: ['Professional Recording', 'Music Production', 'Mixing & Mastering', 'Composition', 'Audio for Video'],
    owner_id: '4',
    contact_email: 'david@sonidosdelsur.com',
    contact_phone: '+34 600 456 789',
    website: 'https://sonidosdelsur.com',
    location: 'Sevilla, España',
    avatar_url: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
    created_at: new Date().toISOString(),
    subscription_tier: 'enterprise',
    is_featured: true
  }
];

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      setError(null);

      console.log('🔍 Cargando usuarios...');

      // MODO DEMO: Solo datos mock (sin mezcla)
      if (isDemoMode) {
        console.log('🎭 HUMANBIBLIO - Modo Demo Activado');
        console.log('✨ Usando datos mock exclusivamente');
        console.log('📊 Analytics deshabilitados en modo demo');
        setUsers(MOCK_USERS);
        setLoading(false);
        return;
      }

      // MODO PRODUCCIÓN: Solo datos reales (NUNCA mock data)
      console.log('🚀 Modo Producción - Cargando perfiles reales');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('⚠️ Error Supabase:', error.message);
        setError('Error al cargar perfiles');
        setUsers([]); // Lista vacía, NO mock data en producción
        return;
      }

      if (data && data.length > 0) {
        console.log('✅ Perfiles reales cargados:', data.length);
        console.log('👤 Mostrando SOLO perfiles reales del piloto');
        setUsers(data); // SOLO datos reales, sin mezcla
      } else {
        console.log('📝 Base de datos vacía - esperando primeros usuarios del piloto');
        setUsers([]); // Lista vacía hasta que haya usuarios reales
      }

    } catch (err) {
      console.error('❌ Error cargando usuarios:', err);
      setError('Error de conexión');
      setUsers([]); // Lista vacía en caso de error
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch: fetchUsers };
}

export function useBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);

    try {
      setError(null);

      console.log('🔍 Cargando negocios...');

      // MODO DEMO: Solo datos mock (sin mezcla)
      if (isDemoMode) {
        console.log('🎭 HUMANBIBLIO - Modo Demo Activado');
        console.log('🛍️ Usando negocios mock exclusivamente');
        console.log('📊 Analytics deshabilitados en modo demo');
        setBusinesses(MOCK_BUSINESSES);
        setLoading(false);
        return;
      }

      // MODO PRODUCCIÓN: Solo datos reales (NUNCA mock data)
      console.log('🚀 Modo Producción - Cargando negocios reales');

      const { data, error } = await supabase
        .from('wb_businesses')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('⚠️ Error Supabase:', error.message);
        setError('Error al cargar negocios');
        setBusinesses([]); // Lista vacía, NO mock data en producción
        return;
      }

      if (data && data.length > 0) {
        console.log('✅ Negocios reales cargados:', data.length);
        console.log('🛍️ Mostrando SOLO negocios reales del piloto');
        setBusinesses(data); // SOLO datos reales, sin mezcla
      } else {
        console.log('📝 Base de datos vacía - esperando primeros negocios del piloto');
        setBusinesses([]); // Lista vacía hasta que haya negocios reales
      }

    } catch (err) {
      console.error('❌ Error cargando negocios:', err);
      setError('Error de conexión');
      setBusinesses([]); // Lista vacía en caso de error
    } finally {
      setLoading(false);
    }
  };

  return { businesses, loading, error, refetch: fetchBusinesses };
}