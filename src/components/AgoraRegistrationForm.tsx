import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
<<<<<<< HEAD
import { useLanguage } from '../contexts/LanguageContext';
=======
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
import ProfilePhotoUploader from './ProfilePhotoUploader';

interface AgoraRegistrationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profession: string;
  topic1: string;
  topic2: string;
  topic3: string;
  bio: string;
  location: string;
  country: string;
  country_flag: string;
  native_language: string;
  age: string;
  relationshipStatus: string;
  lookingFor: string[];
  languages: string[];
  linkedIn: string;
  website: string;
  availability: string;
  connectionGoals: string[];
  privacyLevel: 'public' | 'friends' | 'private';
  isWBSeller: boolean;
}

const CONNECTION_GOALS = [
<<<<<<< HEAD
  'networking.profesional',
  'intercambio.de.conocimientos',
  'colaboraciones.creativas',
  'mentoring.(dar.o.recibir)',
  'proyectos.conjuntos',
  'amistad.intelectual',
  'desarrollo.de.negocios',
  'aprendizaje.continuo'
];

const LOOKING_FOR_OPTIONS = [
  'conexiones.profesionales',
  'amistad.intelectual',
  'colaboraciones.creativas',
  'intercambio.de.conocimientos',
  'mentoring',
  'proyectos.conjuntos',
  'networking',
  'conversaciones.profundas'
];

export default function AgoraRegistrationForm({ isOpen, onClose }: AgoraRegistrationFormProps) {
  const { t } = useLanguage();
=======
  'Networking Profesional',
  'Intercambio de Conocimientos',
  'Colaboraciones Creativas',
  'Mentoring (Dar o Recibir)',
  'Proyectos Conjuntos',
  'Amistad Intelectual',
  'Desarrollo de Negocios',
  'Aprendizaje Continuo'
];

const LOOKING_FOR_OPTIONS = [
  'Conexiones Profesionales',
  'Amistad Intelectual',
  'Colaboraciones Creativas',
  'Intercambio de Conocimientos',
  'Mentoring',
  'Proyectos Conjuntos',
  'Networking',
  'Conversaciones Profundas'
];

export default function AgoraRegistrationForm({ isOpen, onClose }: AgoraRegistrationFormProps) {
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profession: '',
    topic1: '',
    topic2: '',
    topic3: '',
    bio: '',
    location: '',
    country: '',
    country_flag: '',
    native_language: '',
    age: '',
    relationshipStatus: '',
    lookingFor: [],
    languages: ['Español'],
    linkedIn: '',
    website: '',
    availability: 'flexible',
    connectionGoals: [],
    privacyLevel: 'friends',
    isWBSeller: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const { signUp, loading } = useAuth();

  if (!isOpen) return null;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
<<<<<<< HEAD
        if (!formData.fullName.trim()) newErrors.fullName = t('agora.form.error.fullname');
        if (!formData.email.trim()) newErrors.email = t('agora.form.error.email');
        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('agora.form.error.email.invalid');
        if (!formData.password) newErrors.password = t('agora.form.error.password');
        if (formData.password && formData.password.length < 6) newErrors.password = t('agora.form.error.password.min');
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('agora.form.error.password.match');
        break;
      case 2:
        if (!formData.profession.trim()) newErrors.profession = t('agora.form.error.profession');
        if (!formData.topic1.trim()) newErrors.topic1 = t('agora.form.error.topic1');
        if (!formData.topic2.trim()) newErrors.topic2 = t('agora.form.error.topic2');
        if (!formData.topic3.trim()) newErrors.topic3 = t('agora.form.error.topic3');
        if (!formData.bio.trim()) newErrors.bio = t('agora.form.error.bio');
        if (formData.bio.length < 50) newErrors.bio = t('agora.form.error.bio.min');
        break;
      case 3:
        if (!formData.location.trim()) newErrors.location = t('agora.form.error.location');
        if (formData.connectionGoals.length === 0) newErrors.connectionGoals = t('agora.form.error.goals');
=======
        if (!formData.fullName.trim()) newErrors.fullName = 'Nombre completo es requerido';
        if (!formData.email.trim()) newErrors.email = 'Email es requerido';
        if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
        if (!formData.password) newErrors.password = 'Contraseña es requerida';
        if (formData.password && formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
        if (formData.confirmPassword && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
        break;
      case 2:
        if (!formData.profession.trim()) newErrors.profession = 'Tu profesión es requerida';
        if (!formData.topic1.trim()) newErrors.topic1 = 'El primer tema es requerido';
        if (!formData.topic2.trim()) newErrors.topic2 = 'El segundo tema es requerido';
        if (!formData.topic3.trim()) newErrors.topic3 = 'El tercer tema es requerido';
        if (!formData.bio.trim()) newErrors.bio = 'Biografía es requerida';
        if (formData.bio.length < 50) newErrors.bio = 'La biografía debe tener al menos 50 caracteres';
        break;
      case 3:
        if (!formData.location.trim()) newErrors.location = 'Ubicación es requerida';
        if (formData.connectionGoals.length === 0) newErrors.connectionGoals = 'Selecciona al menos un objetivo de conexión';
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        profession: formData.profession,
        bio: formData.bio,
        interests: [formData.topic1, formData.topic2, formData.topic3],
        location: formData.location,
        country: formData.country,
        country_flag: formData.country_flag,
        native_language: formData.native_language,
        languages_spoken: formData.languages,
        avatar_url: profilePhoto ? URL.createObjectURL(profilePhoto) : undefined,
        is_wb_seller: formData.isWBSeller
      });
      
      onClose();
<<<<<<< HEAD
      alert(profilePhoto ? t('agora.form.success.photo') : t('agora.form.success'));
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: t('agora.form.error') });
=======
      alert(`¡Bienvenido al Ágora! Tu perfil${profilePhoto ? ' con foto' : ''} ha sido creado exitosamente. 🏛️✨`);
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Error al crear la cuenta. Inténtalo de nuevo.' });
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🏛️</div>
<<<<<<< HEAD
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('agora.form.step1.title')}</h3>
              <p className="text-gray-600">{t('agora.form.step1.subtitle')}</p>
=======
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Información Básica</h3>
              <p className="text-gray-600">Comencemos con tus datos fundamentales</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.fullname')}
=======
                  Nombre Completo *
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
<<<<<<< HEAD
                  placeholder={t('agora.form.fullname.placeholder')}
=======
                  placeholder="Tu nombre completo"
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.email')}
=======
                  Email *
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
<<<<<<< HEAD
                  placeholder={t('agora.form.email.placeholder')}
=======
                  placeholder="tu@email.com"
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.password')}
=======
                  Contraseña *
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
<<<<<<< HEAD
                  placeholder={t('agora.form.password.placeholder')}
=======
                  placeholder="Mínimo 6 caracteres"
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.confirm.password')}
=======
                  Confirmar Contraseña *
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
<<<<<<< HEAD
                  placeholder={t('agora.form.confirm.password.placeholder')}
=======
                  placeholder="Repite tu contraseña"
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Información Dating Discreta */}
            <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
              <h4 className="font-semibold text-pink-900 mb-4 flex items-center">
                <span className="mr-2">💕</span>
<<<<<<< HEAD
                {t('agora.form.dating.title')}
=======
                Información Personal (Opcional y Discreta)
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                    {t('agora.form.age')}
=======
                    Edad (Opcional)
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                  </label>
                  <select
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
<<<<<<< HEAD
                    <option value="">{t('agora.form.age.not.say')}</option>
                    <option value="18-25">{t('agora.form.age.18.25')}</option>
                    <option value="26-35">{t('agora.form.age.26.35')}</option>
                    <option value="36-45">{t('agora.form.age.36.45')}</option>
                    <option value="46-55">{t('agora.form.age.46.55')}</option>
                    <option value="56+">{t('agora.form.age.56plus')}</option>
=======
                    <option value="">Prefiero no decir</option>
                    <option value="18-25">18-25 años</option>
                    <option value="26-35">26-35 años</option>
                    <option value="36-45">36-45 años</option>
                    <option value="46-55">46-55 años</option>
                    <option value="56+">56+ años</option>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                    {t('agora.form.relationship')}
=======
                    Estado Civil (Opcional)
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                  </label>
                  <select
                    value={formData.relationshipStatus}
                    onChange={(e) => setFormData(prev => ({ ...prev, relationshipStatus: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
<<<<<<< HEAD
                    <option value="">{t('agora.form.relationship.not.say')}</option>
                    <option value="soltero">{t('agora.form.relationship.single')}</option>
                    <option value="en-relacion">{t('agora.form.relationship.dating')}</option>
                    <option value="casado">{t('agora.form.relationship.married')}</option>
                    <option value="divorciado">{t('agora.form.relationship.divorced')}</option>
                    <option value="viudo">{t('agora.form.relationship.widowed')}</option>
                    <option value="es-complicado">{t('agora.form.relationship.complicated')}</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('agora.form.looking.for')}
=======
                    <option value="">Prefiero no decir</option>
                    <option value="soltero">Soltero/a</option>
                    <option value="en-relacion">En relación</option>
                    <option value="casado">Casado/a</option>
                    <option value="divorciado">Divorciado/a</option>
                    <option value="viudo">Viudo/a</option>
                    <option value="es-complicado">Es complicado</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Qué buscas en HUMANBIBLIO? (Opcional - Selecciona todos los que apliquen)
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {LOOKING_FOR_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer hover:bg-pink-50 p-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.lookingFor.includes(option)}
                        onChange={() => toggleArrayItem(
<<<<<<< HEAD
                          formData.lookingFor,
                          option,
=======
                          formData.lookingFor, 
                          option, 
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                          (value) => setFormData(prev => ({ ...prev, lookingFor: value }))
                        )}
                        className="text-pink-600 focus:ring-pink-500"
                      />
<<<<<<< HEAD
                      <span className="text-sm">{t(`agora.form.looking.${option}`)}</span>
=======
                      <span className="text-sm">{option}</span>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.privacy.level')}
=======
                  Nivel de Privacidad
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center space-x-2 cursor-pointer hover:bg-pink-50 p-3 rounded-lg border border-gray-200">
                    <input
                      type="radio"
                      name="privacyLevel"
                      value="public"
                      checked={formData.privacyLevel === 'public'}
                      onChange={(e) => setFormData(prev => ({ ...prev, privacyLevel: e.target.value as any }))}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <div className="text-center">
                      <div className="text-lg">🌍</div>
<<<<<<< HEAD
                      <div className="text-xs font-medium">{t('agora.form.privacy.public')}</div>
=======
                      <div className="text-xs font-medium">Público</div>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer hover:bg-pink-50 p-3 rounded-lg border border-gray-200">
                    <input
                      type="radio"
                      name="privacyLevel"
                      value="friends"
                      checked={formData.privacyLevel === 'friends'}
                      onChange={(e) => setFormData(prev => ({ ...prev, privacyLevel: e.target.value as any }))}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <div className="text-center">
                      <div className="text-lg">👥</div>
<<<<<<< HEAD
                      <div className="text-xs font-medium">{t('agora.form.privacy.friends')}</div>
=======
                      <div className="text-xs font-medium">Conexiones</div>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                    </div>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer hover:bg-pink-50 p-3 rounded-lg border border-gray-200">
                    <input
                      type="radio"
                      name="privacyLevel"
                      value="private"
                      checked={formData.privacyLevel === 'private'}
                      onChange={(e) => setFormData(prev => ({ ...prev, privacyLevel: e.target.value as any }))}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <div className="text-center">
                      <div className="text-lg">🔒</div>
<<<<<<< HEAD
                      <div className="text-xs font-medium">{t('agora.form.privacy.private')}</div>
=======
                      <div className="text-xs font-medium">Privado</div>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🎯</div>
<<<<<<< HEAD
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('agora.form.step2.title')}</h3>
              <p className="text-gray-600">{t('agora.form.step2.subtitle')}</p>
=======
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Tus 3 Temas de Intercambio</h3>
              <p className="text-gray-600">Escribe libremente los 3 temas sobre los que te encanta conversar</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            </div>

            {/* Profile Photo Upload */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
<<<<<<< HEAD
              <h4 className="font-semibold text-blue-900 mb-4 text-center">{t('agora.form.photo.title')}</h4>
=======
              <h4 className="font-semibold text-blue-900 mb-4 text-center">📸 Foto de Perfil</h4>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              <ProfilePhotoUploader
                onPhotoUpload={(file) => {
                  setProfilePhoto(file);
                  setPhotoUploading(true);
                  setTimeout(() => {
                    setPhotoUploading(false);
                    console.log('Foto de perfil subida:', file.name);
                  }, 1500);
                }}
                onPhotoRemove={() => {
                  setProfilePhoto(null);
                }}
                isUploading={photoUploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                {t('agora.form.profession')}
=======
                Tu Profesión o Actividad Principal *
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.profession ? 'border-red-500' : 'border-gray-300'
                }`}
<<<<<<< HEAD
                placeholder={t('agora.form.profession.placeholder')}
=======
                placeholder="Ej: Psicóloga, Desarrollador, Chef, Artista, Consultor..."
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              />
              {errors.profession && <p className="text-red-500 text-sm mt-1">{errors.profession}</p>}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl">
              <div className="flex items-start">
                <div className="text-2xl mr-3">💡</div>
                <div>
<<<<<<< HEAD
                  <h4 className="font-semibold text-blue-900 mb-2">{t('agora.form.examples.title')}</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• <strong>{t('agora.form.examples.professional')}</strong> {t('agora.form.examples.professional.text')}</p>
                    <p>• <strong>{t('agora.form.examples.creative')}</strong> {t('agora.form.examples.creative.text')}</p>
                    <p>• <strong>{t('agora.form.examples.unique')}</strong> {t('agora.form.examples.unique.text')}</p>
=======
                  <h4 className="font-semibold text-blue-900 mb-2">Ejemplos de temas únicos:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• <strong>Profesionales:</strong> Charcutería artesanal, Piscicultura, Desarrollo de videojuegos</p>
                    <p>• <strong>Creativos:</strong> Tejido en crochet, Cerámica japonesa, Fotografía nocturna</p>
                    <p>• <strong>Únicos:</strong> Cultivo de orquídeas, Historia del jazz, Cocina molecular</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.topic1')}
=======
                  🎯 Tema 1: Tu expertise profesional o principal pasión *
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="text"
                  value={formData.topic1}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic1: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.topic1 ? 'border-red-500' : 'border-gray-300'
                  }`}
<<<<<<< HEAD
                  placeholder={t('agora.form.topic1.placeholder')}
=======
                  placeholder="Ej: Desarrollo de aplicaciones móviles, Psicología clínica, Charcutería artesanal..."
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
                {errors.topic1 && <p className="text-red-500 text-sm mt-1">{errors.topic1}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.topic2')}
=======
                  🎨 Tema 2: Tu hobby o interés creativo favorito *
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="text"
                  value={formData.topic2}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic2: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.topic2 ? 'border-red-500' : 'border-gray-300'
                  }`}
<<<<<<< HEAD
                  placeholder={t('agora.form.topic2.placeholder')}
=======
                  placeholder="Ej: Tejido en crochet, Fotografía de naturaleza, Cultivo de orquídeas..."
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
                {errors.topic2 && <p className="text-red-500 text-sm mt-1">{errors.topic2}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.topic3')}
=======
                  🌱 Tema 3: Algo que quieres aprender o explorar *
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="text"
                  value={formData.topic3}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic3: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.topic3 ? 'border-red-500' : 'border-gray-300'
                  }`}
<<<<<<< HEAD
                  placeholder={t('agora.form.topic3.placeholder')}
=======
                  placeholder="Ej: Piscicultura artesanal, Historia del jazz, Cocina molecular..."
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
                {errors.topic3 && <p className="text-red-500 text-sm mt-1">{errors.topic3}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                {t('agora.form.bio')}
=======
                Cuéntanos sobre ti y por qué te interesan estos 3 temas * (Mínimo 50 caracteres)
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bio ? 'border-red-500' : 'border-gray-300'
                }`}
<<<<<<< HEAD
                placeholder={t('agora.form.bio.placeholder')}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                <p className="text-gray-500 text-sm">{formData.bio.length}/50 {t('agora.form.bio.min')}</p>
=======
                placeholder="Describe brevemente quién eres y por qué te apasionan los 3 temas que elegiste. Esto ayudará a otros a conectar contigo de manera más auténtica..."
              />
              <div className="flex justify-between items-center mt-1">
                {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
                <p className="text-gray-500 text-sm">{formData.bio.length}/50 caracteres mínimo</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">🤝</div>
<<<<<<< HEAD
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('agora.form.step3.title')}</h3>
              <p className="text-gray-600">{t('agora.form.step3.subtitle')}</p>
=======
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Finalizar Perfil</h3>
              <p className="text-gray-600">Información adicional y objetivos de conexión</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.location')}
=======
                  Ubicación *
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
<<<<<<< HEAD
                  placeholder={t('agora.form.location.placeholder')}
=======
                  placeholder="Ciudad, País"
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.languages')}
=======
                  Idiomas que Hablas
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="text"
                  value={formData.languages.join(', ')}
<<<<<<< HEAD
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    languages: e.target.value.split(',').map(lang => lang.trim()).filter(Boolean)
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('agora.form.languages.placeholder')}
=======
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    languages: e.target.value.split(',').map(lang => lang.trim()).filter(Boolean)
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Español, Inglés, Francés..."
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.linkedin')}
=======
                  LinkedIn (Opcional)
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
<<<<<<< HEAD
                  placeholder={t('agora.form.linkedin.placeholder')}
=======
                  placeholder="https://linkedin.com/in/tu-perfil"
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                  {t('agora.form.website')}
=======
                  Sitio Web Personal (Opcional)
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
<<<<<<< HEAD
                  placeholder={t('agora.form.website.placeholder')}
=======
                  placeholder="https://tu-sitio-web.com"
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                {t('agora.form.goals')}
=======
                ¿Qué buscas en el Ágora? * (Selecciona todos los que apliquen)
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CONNECTION_GOALS.map((goal) => (
                  <label key={goal} className="flex items-center space-x-3 cursor-pointer hover:bg-purple-50 p-3 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      checked={formData.connectionGoals.includes(goal)}
                      onChange={() => toggleArrayItem(
<<<<<<< HEAD
                        formData.connectionGoals,
                        goal,
=======
                        formData.connectionGoals, 
                        goal, 
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                        (value) => setFormData(prev => ({ ...prev, connectionGoals: value }))
                      )}
                      className="text-purple-600 focus:ring-purple-500"
                    />
<<<<<<< HEAD
                    <span className="font-medium">{t(`agora.form.goal.${goal}`)}</span>
=======
                    <span className="font-medium">{goal}</span>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                  </label>
                ))}
              </div>
              {errors.connectionGoals && <p className="text-red-500 text-sm mt-1">{errors.connectionGoals}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
<<<<<<< HEAD
                {t('agora.form.availability')}
=======
                Disponibilidad para Conexiones
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
<<<<<<< HEAD
                <option value="muy-activo">{t('agora.form.availability.very.active')}</option>
                <option value="activo">{t('agora.form.availability.active')}</option>
                <option value="flexible">{t('agora.form.availability.flexible')}</option>
                <option value="ocasional">{t('agora.form.availability.occasional')}</option>
                <option value="limitado">{t('agora.form.availability.limited')}</option>
=======
                <option value="muy-activo">Muy Activo (Varias veces al día)</option>
                <option value="activo">Activo (Una vez al día)</option>
                <option value="flexible">Flexible (Varias veces por semana)</option>
                <option value="ocasional">Ocasional (Una vez por semana)</option>
                <option value="limitado">Limitado (Cuando sea necesario)</option>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </select>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
              <h4 className="font-semibold text-emerald-900 mb-4 flex items-center">
                <span className="mr-2">🛍️</span>
<<<<<<< HEAD
                {t('agora.form.wb.seller.title')}
=======
                ¿También vendes productos o servicios?
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </h4>
              <label className="flex items-start space-x-3 cursor-pointer hover:bg-emerald-100 p-3 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.isWBSeller}
                  onChange={(e) => setFormData(prev => ({ ...prev, isWBSeller: e.target.checked }))}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500 w-5 h-5"
                />
                <div>
<<<<<<< HEAD
                  <span className="font-medium text-emerald-900 block">{t('agora.form.wb.seller.yes')}</span>
                  <span className="text-sm text-emerald-700">
                    {t('agora.form.wb.seller.description')}
=======
                  <span className="font-medium text-emerald-900 block">Sí, también vendo en World Boulevard</span>
                  <span className="text-sm text-emerald-700">
                    Tu perfil mostrará el logo WB 🟢 y podrás vender tus productos/servicios en World Boulevard
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                  </span>
                </div>
              </label>
              <div className="mt-4 text-xs text-emerald-700 bg-emerald-100 p-3 rounded-lg">
<<<<<<< HEAD
                <strong>{t('agora.form.wb.benefits')}</strong> {t('agora.form.wb.benefits.text')}
=======
                <strong>Beneficios:</strong> Perfil comercial, Galería multimedia, Chat directo con clientes, Geolocalización inteligente
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <span className="mr-2">🏛️</span>
<<<<<<< HEAD
                {t('agora.form.welcome.title')}
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• <strong>{t('agora.form.welcome.1')}</strong> {t('agora.form.welcome.1.text')}</p>
                <p>• <strong>{t('agora.form.welcome.2')}</strong> {t('agora.form.welcome.2.text')}</p>
                <p>• <strong>{t('agora.form.welcome.3')}</strong> {t('agora.form.welcome.3.text')}</p>
                <p>• <strong>{t('agora.form.welcome.4')}</strong> {t('agora.form.welcome.4.text')}</p>
                <p>• <strong>{t('agora.form.welcome.5')}</strong> {t('agora.form.welcome.5.text')}</p>
=======
                ¡Bienvenido al Ágora!
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• <strong>Conexiones auténticas</strong> basadas en tus 3 temas únicos</p>
                <p>• <strong>Chat IA contextual</strong> especializado en tus áreas de interés</p>
                <p>• <strong>Perfil con foto</strong> para conexiones más humanas</p>
                <p>• <strong>Matching inteligente</strong> con personas afines</p>
                <p>• <strong>Intercambio de conocimientos</strong> únicos y especializados</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
<<<<<<< HEAD
              {t('agora.form.title')}
            </h2>
            <p className="text-gray-600">{t('agora.form.subtitle')}</p>
=======
              🏛️ Únete al Ágora
            </h2>
            <p className="text-gray-600">El Encuentro de Mentes Extraordinarias</p>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
<<<<<<< HEAD
              <span className="text-sm font-medium text-gray-700">{t('agora.form.step')} {currentStep} {t('agora.form.of')} 3</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% {t('agora.form.completed')}</span>
=======
              <span className="text-sm font-medium text-gray-700">Paso {currentStep} de 3</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 3) * 100)}% completado</span>
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Error Message */}
          {errors.submit && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
<<<<<<< HEAD
              {t('agora.form.previous')}
=======
              ← Anterior
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
            </button>

            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg"
                >
<<<<<<< HEAD
                  {t('agora.form.next')}
=======
                  Siguiente →
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg disabled:opacity-50"
                >
<<<<<<< HEAD
                  {loading ? t('agora.form.creating') : t('agora.form.join')}
=======
                  {loading ? 'Creando cuenta...' : '🏛️ Unirse al Ágora'}
>>>>>>> d2f4627176dbd2b45f9f32eb8f6c4ad1770ae193
                </button>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}