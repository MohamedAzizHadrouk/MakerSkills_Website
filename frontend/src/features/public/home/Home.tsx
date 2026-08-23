import React, { useState, useEffect } from 'react';
import { ArrowRight, Cpu, Bot, Brain, Lightbulb, Users, Award, Globe, Star, Clock, ChevronLeft, ChevronRight, Play, CheckCircle, Quote, Calendar, MapPin, Target, Eye, Heart, Handshake, ExternalLink, Mail, Phone, User, Building, Briefcase, GraduationCap } from 'lucide-react';
import { useStore } from '../../../stores/useStore';
import { translations } from '../../../data/translations';
import TestimonialsSection from './components/TestimonialsSection';
import ReviewService from '../../admin/reviews/review.service';
import { Review } from '../../admin/reviews/review';
import StatsSection from './components/StatsSection';
import { aboutValues } from './data/aboutValues';
import { team } from './data/team';
import { whyChooseUs } from './data/whyChooseUs';
import { features } from './data/features';
import { contactTypes } from './data/contactTypes';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import CalendarSection from './components/CalendarSection';
import NewsSection from './components/NewsSection';
import FeaturesSection from './components/FeaturesSection';
import PartnersSection from './components/PartnersSection';
import PartnerService from '../../admin/partners/partner.service';
import { Partner } from '../../admin/partners/partner';
import ContactSection from './components/ContactSection';
import CtaSection from './components/CtaSection';
import BlogService from '../../admin/blogs/blogs.service';
import { Blog } from '../../admin/blogs/blog';
import HeroSectionService from '../../admin/hero-section/hero-section.service';
import { HeroSection as HeroSectionType } from '../../admin/hero-section/hero-section';
import { getImageUrl } from '../../../shared/utils/imageUtils';

const Home: React.FC = () => {
  const { theme, language } = useStore();
  const t = translations[language];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSections, setHeroSections] = useState<HeroSectionType[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [partners, setPartners] = useState<Partner[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  // Convertir les HeroSection en HeroSlide pour le composant
  const heroSlides = heroSections.map(section => ({
    type: section.type,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    image: section.image ? getImageUrl(section.image) : '',
    video: undefined,
    cta: section.buttons && section.buttons.length > 0 ? section.buttons[0].name : 'Découvrir',
    link: section.buttons && section.buttons.length > 0 ? section.buttons[0].action : '/services'
  }));

  useEffect(() => {
    // Charger les hero sections depuis l'API
    const loadHeroSections = async () => {
      try {
        const data = await HeroSectionService.getAll();
        setHeroSections(data);
      } catch (error) {
        console.error('Erreur lors du chargement des hero sections:', error);
        setHeroSections([]);
      }
    };
    loadHeroSections();
  }, []);

  useEffect(() => {
    if (heroSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [heroSlides.length]);

  useEffect(() => {
    PartnerService.getAll().then((data) => setPartners(data));
  }, []);

  useEffect(() => {
    ReviewService.getAll().then((data) => setReviews(data));
  }, []);

  useEffect(() => {
    BlogService.getAll().then((data) => setBlogs(data));
  }, []);

  const achievements = [
    {
      icon: Users,
      number: '500+',
      label: 'Étudiants Formés',
      description: 'Apprenants satisfaits'
    },
    {
      icon: Award,
      number: '50+',
      label: 'Projets Réalisés',
      description: 'Innovations concrètes'
    },
    {
      icon: Globe,
      number: '10+',
      label: 'Partenaires',
      description: 'Entreprises partenaires'
    },
    {
      icon: Brain,
      number: '15+',
      label: 'Formations',
      description: 'Programmes disponibles'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'formation': return 'bg-blue-900';
      case 'bootcamp': return 'bg-orange-500';
      case 'workshop': return 'bg-blue-600';
      case 'event': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'formation': return 'Formation';
      case 'bootcamp': return 'Bootcamp';
      case 'workshop': return 'Workshop';
      case 'event': return 'Événement';
      default: return type;
    }
  };

  const nextSlide = () => {
    if (heroSlides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }
  };

  const prevSlide = () => {
    if (heroSlides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      type: 'general'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      {/* Hero Section with Carousel */}
      {heroSlides.length > 0 && (
        <HeroSection
          slides={heroSlides}
          theme={theme}
          currentSlide={currentSlide}
          onPrev={prevSlide}
          onNext={nextSlide}
          onSelect={(index) => setCurrentSlide(index)}
        />
      )}

      {/* About Section - Enriched and Moved After Banner */}
      <AboutSection
        theme={theme}
        aboutValues={aboutValues}
        team={team}
        whyChooseUs={whyChooseUs}
      />

      {/* Features Section */}
      <FeaturesSection theme={theme} features={features} t={t} />

      {/* Calendar Section */}
     <CalendarSection/>

      {/* Partners Section */}
      <PartnersSection
        theme={theme}
        partners={partners.map((p) => ({
          _id: p._id ,
          name: p.name,
          logo: p.logo || '',
          website: p.website || '',
          specialite: p.specialite || 'Partenaire',
          
        }))}
      />

      {/* Stats Section */}
      <StatsSection achievements={achievements} />

      {/* Contact Form Section */}
      <ContactSection theme={theme} formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} contactTypes={contactTypes} />

      {/* Testimonials Section */}
      <TestimonialsSection reviews={reviews} />

      {/* News Section */}
      <NewsSection blogs={blogs} />

      {/* CTA Section */}
      <CtaSection theme={theme} />
    </div>
  );
};

export default Home;