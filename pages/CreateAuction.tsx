import React, { useState, useEffect, useRef } from 'react';
import { AuctionType } from '../types';
import { generateAuctionDescription, validateAddress, searchPlaces } from '../services/geminiService';
import { Wand2, Loader2, Upload, AlertCircle, Calendar, FileText, CheckCircle, Image as ImageIcon, X, Car, Home, ArrowLeft, Sparkles, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuctionFormState {
  // Images
  images: string[];
  
  // Basic Info
  title: string;
  type: AuctionType;
  year: string;
  make: string;
  model: string;
  trim: string;
  vin: string;
  titleStatus: string;
  location: string;
  
  // Tech Specs (Auto)
  mileage: string;
  transmission: string;
  bodyType: string;
  fuelType: string;
  engine: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;

  // Property Specs
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  lotSize: string;
  zoning: string;
  hoaFees: string;
  propertyType: string;
  
  // Condition
  conditionRating: string;
  conditionDescription: string;
  accidentHistory: string; // "Yes" or "No"
  recentService: string; // Used for "Recent Upgrades" in property
  modifications: string;
  maintenanceRecords: string; // Placeholder for file name
  
  // Settings
  startDate: string;
  duration: string;
  startingPrice: string;
  reservePrice: string;
  buyItNowPrice: string;
  termsAccepted: boolean;
  
  // Generated/System
  description: string;
}

const INITIAL_STATE: AuctionFormState = {
  images: [],
  title: '',
  type: AuctionType.AUTOMOBILE,
  year: '',
  make: '',
  model: '',
  trim: '',
  vin: '',
  titleStatus: '',
  location: '',
  mileage: '',
  transmission: '',
  bodyType: '',
  fuelType: '',
  engine: '',
  drivetrain: '',
  exteriorColor: '',
  interiorColor: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  lotSize: '',
  zoning: '',
  hoaFees: '',
  propertyType: '',
  conditionRating: 'Good',
  conditionDescription: '',
  accidentHistory: 'No',
  recentService: '',
  modifications: '',
  maintenanceRecords: '',
  startDate: '',
  duration: '7',
  startingPrice: '',
  reservePrice: '',
  buyItNowPrice: '',
  termsAccepted: false,
  description: ''
};

const InputError = ({ name, touched, errors }: { name: string, touched: Record<string, boolean>, errors: Record<string, string> }) => {
  if ((!touched[name] && name !== 'images') || !errors[name]) return null;
  return <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle size={10} className="mr-1"/> {errors[name]}</p>;
};

const MAX_IMAGES = 12;
const MAX_FILE_SIZE_MB = 5;

const CreateAuction: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [validatingLocation, setValidatingLocation] = useState(false);
  const [formData, setFormData] = useState<AuctionFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Location Autocomplete State
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const locationWrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [locationWrapperRef]);

  // Debounced Place Search
  useEffect(() => {
    const fetchSuggestions = async () => {
        if (formData.location.length > 3 && showLocationSuggestions) {
            setLoadingSuggestions(true);
            const results = await searchPlaces(formData.location);
            if (results.length > 0) {
                setLocationSuggestions(results);
            }
            setLoadingSuggestions(false);
        }
    };

    const timer = setTimeout(fetchSuggestions, 800); // 800ms debounce
    return () => clearTimeout(timer);
  }, [formData.location, showLocationSuggestions]);

  const handleSelectType = (type: AuctionType) => {
      setFormData(prev => ({ 
          ...INITIAL_STATE, // Reset form when switching to avoid incompatible fields
          type, 
          images: prev.images // Keep images if any
      }));
      setErrors({});
      setTouched({});
  };

  // Real-time validation logic
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'images':
         if (formData.images.length === 0) return 'At least one image is required';
         return '';
      case 'year':
        if (!value) return 'Year is required';
        if (parseInt(value) < 1800 || parseInt(value) > new Date().getFullYear() + 5) return 'Invalid year';
        return '';
      // Common required fields
      case 'location':
      case 'titleStatus':
      case 'startingPrice':
        return !value ? 'This field is required' : '';
        
      // Auto specific
      case 'make':
      case 'model':
      case 'transmission':
        if (formData.type === AuctionType.AUTOMOBILE && !value) return 'This field is required';
        return '';
      case 'vin':
        if (formData.type === AuctionType.AUTOMOBILE) {
            if (!value) return 'VIN is required';
            if (value.length !== 17) return 'VIN must be exactly 17 characters';
        }
        return '';
      case 'mileage':
        if (formData.type === AuctionType.AUTOMOBILE) {
            if (!value) return 'Mileage is required';
            if (parseInt(value) < 0) return 'Mileage cannot be negative';
        }
        return '';

      // Property specific
      case 'sqft':
      case 'propertyType':
        if (formData.type === AuctionType.PROPERTY && !value) return 'This field is required';
        return '';

      // Price logic
      case 'startingPrice':
        if (!value) return 'Starting price is required';
        if (parseFloat(value) <= 0) return 'Price must be greater than 0';
        return '';
      case 'reservePrice':
        if (value && parseFloat(value) < parseFloat(formData.startingPrice)) return 'Reserve cannot be lower than starting price';
        return '';
      case 'termsAccepted':
        return !value ? 'You must accept the terms' : '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    if (name === 'location') {
        setShowLocationSuggestions(value.length > 2);
    }

    // Validate immediately if already touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, finalValue) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Limit check
      if (formData.images.length + files.length > MAX_IMAGES) {
         setErrors(prev => ({ ...prev, images: `You can only upload a maximum of ${MAX_IMAGES} images.` }));
         setTouched(prev => ({ ...prev, images: true }));
         return;
      }

      // Size check
      const oversizeFiles = files.filter((file: File) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
      if (oversizeFiles.length > 0) {
         setErrors(prev => ({ ...prev, images: `Images must be smaller than ${MAX_FILE_SIZE_MB}MB.` }));
         setTouched(prev => ({ ...prev, images: true }));
         return;
      }

      // Create local object URLs for preview (Simulation of upload)
      const newImages = files.map((file: any) => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      
      // Clear error if exists
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleMaintenanceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setFormData(prev => ({ ...prev, maintenanceRecords: e.target.files![0].name }));
      }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
       ...prev,
       images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleGenerateDescription = async () => {
    let title = '';
    let specsSummary = '';

    if (formData.type === AuctionType.AUTOMOBILE) {
        if (!formData.year || !formData.make || !formData.model) {
            alert("Please provide at least Year, Make, and Model to generate a description.");
            return;
        }
        title = `${formData.year} ${formData.make} ${formData.model} ${formData.trim}`;
        specsSummary = `
        - Engine: ${formData.engine || 'N/A'}
        - Transmission: ${formData.transmission || 'N/A'}
        - Body Type: ${formData.bodyType}
        - Mileage: ${formData.mileage} miles
        - Exterior: ${formData.exteriorColor} / Interior: ${formData.interiorColor}
        - Condition: ${formData.conditionRating}. ${formData.conditionDescription}
        - Modifications: ${formData.modifications}
        `;
    } else {
        if (!formData.propertyType || !formData.location) {
            alert("Please provide Property Type and Location first.");
            return;
        }
        title = `${formData.year ? formData.year + ' ' : ''}${formData.propertyType} in ${formData.location}`;
        specsSummary = `
        - ${formData.bedrooms} Beds, ${formData.bathrooms} Baths
        - Size: ${formData.sqft} sqft
        - Lot: ${formData.lotSize} acres
        - Zoning: ${formData.zoning}
        - Condition: ${formData.conditionRating}. ${formData.conditionDescription}
        - Features: ${formData.modifications}
        `;
    }

    setAiLoading(true);
    const desc = await generateAuctionDescription(title, specsSummary);
    setFormData(prev => ({ ...prev, description: desc }));
    setAiLoading(false);
  };

  const handleValidateLocation = async () => {
      if (!formData.location) return;
      setValidatingLocation(true);
      const validated = await validateAddress(formData.location);
      if (validated) {
          setFormData(prev => ({ ...prev, location: validated }));
          setShowLocationSuggestions(false);
      }
      setValidatingLocation(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if(key !== 'images') {
         const error = validateField(key, (formData as any)[key]);
         if (error) newErrors[key] = error;
      }
    });

    if (formData.images.length === 0) {
       newErrors.images = "At least one image is required.";
    }

    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({...acc, [key]: true}), {}));

    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  // --- Render Form ---
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
              <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </button>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-visible relative">
        <div className="p-6 md:p-8 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
                Create New Listing
            </h1>
            <p className="text-gray-500 mt-1">Select your asset type and fill in the details.</p>
          </div>
          
          {/* Type Toggle */}
          <div className="bg-gray-200 p-1 rounded-lg flex items-center">
              <button 
                type="button"
                onClick={() => handleSelectType(AuctionType.AUTOMOBILE)}
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center transition-all ${
                    formData.type === AuctionType.AUTOMOBILE 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                  <Car size={16} className="mr-2" /> Automobile
              </button>
              <button 
                type="button"
                onClick={() => handleSelectType(AuctionType.PROPERTY)}
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center transition-all ${
                    formData.type === AuctionType.PROPERTY 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                  <Home size={16} className="mr-2" /> Property
              </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
          
          {/* Section 0: Photos */}
          <section className="space-y-6">
            <div className="flex justify-between items-center border-b pb-2">
               <h2 className="text-xl font-bold text-gray-800 flex items-center">
                 <ImageIcon className="mr-2 text-blue-600" /> {formData.type === AuctionType.AUTOMOBILE ? 'Vehicle' : 'Property'} Photos *
               </h2>
               <span className="text-sm text-gray-500">{formData.images.length} / {MAX_IMAGES}</span>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
               <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={formData.images.length >= MAX_IMAGES}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
               />
               <div className="flex flex-col items-center justify-center pointer-events-none">
                  <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
                     <Upload size={24} />
                  </div>
                  <p className="font-bold text-gray-900">Click or drag images here</p>
                  <p className="text-sm text-gray-500 mt-1">Supported formats: JPG, PNG, WEBP (Max {MAX_IMAGES} photos, {MAX_FILE_SIZE_MB}MB each)</p>
               </div>
            </div>
            
            <InputError name="images" touched={touched} errors={errors} />

            {/* Image Previews */}
            {formData.images.length > 0 && (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.images.map((img, idx) => (
                     <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video">
                        <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        <button
                           type="button"
                           onClick={() => removeImage(idx)}
                           className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                           <X size={14} />
                        </button>
                        {idx === 0 && <span className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">Cover</span>}
                     </div>
                  ))}
               </div>
            )}
          </section>

          {/* Section 1: Basic Information */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center border-b pb-2">
              <FileText className="mr-2 text-blue-600" /> Basic Information
            </h2>
            
            {formData.type === AuctionType.AUTOMOBILE ? (
                // --- CAR BASIC INFO ---
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                        <input
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.year ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                        placeholder="2023"
                        />
                        <InputError name="year" touched={touched} errors={errors} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Make *</label>
                        <input
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.make ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                        placeholder="Porsche"
                        />
                        <InputError name="make" touched={touched} errors={errors} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Model *</label>
                        <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.model ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                        placeholder="911 GT3"
                        />
                        <InputError name="model" touched={touched} errors={errors} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trim/Edition</label>
                        <input
                        type="text"
                        name="trim"
                        value={formData.trim}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Touring Package"
                        />
                    </div>
                </div>
            ) : (
                // --- PROPERTY BASIC INFO ---
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                        <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.propertyType ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                        >
                            <option value="">Select Type</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Land">Land</option>
                            <option value="Industrial">Industrial</option>
                        </select>
                        <InputError name="propertyType" touched={touched} errors={errors} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                        <input
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 1995"
                        />
                        <InputError name="year" touched={touched} errors={errors} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zoning</label>
                        <input
                            type="text"
                            name="zoning"
                            value={formData.zoning}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. R1, C2"
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formData.type === AuctionType.AUTOMOBILE && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">VIN (Vehicle Identification Number) *</label>
                    <input
                        type="text"
                        name="vin"
                        maxLength={17}
                        value={formData.vin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none font-mono uppercase ${errors.vin ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                        placeholder="1HGCM..."
                    />
                    <InputError name="vin" touched={touched} errors={errors} />
                  </div>
              )}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Title Status *</label>
                 <select
                  name="titleStatus"
                  value={formData.titleStatus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.titleStatus ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                >
                  <option value="">Select Status</option>
                  <option value="Clean">Clean</option>
                  <option value="Salvage">Salvage</option>
                  <option value="Rebuilt">Rebuilt</option>
                  <option value="Lien">Lien Holder</option>
                </select>
                <InputError name="titleStatus" touched={touched} errors={errors} />
              </div>
              <div className={formData.type === AuctionType.PROPERTY ? "md:col-span-2" : ""} ref={locationWrapperRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full pl-10 pr-24 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.location ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                        placeholder={formData.type === AuctionType.AUTOMOBILE ? "Los Angeles, CA" : "123 Main St, Miami, FL"}
                        autoComplete="off"
                    />
                    <div className="absolute right-1 top-1 bottom-1 flex items-center">
                        {loadingSuggestions && <Loader2 size={16} className="animate-spin text-gray-400 mr-2" />}
                        <button 
                            type="button"
                            onClick={handleValidateLocation}
                            disabled={validatingLocation || !formData.location}
                            className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md text-xs font-bold transition-colors h-full flex items-center"
                        >
                            {validatingLocation ? <Loader2 size={12} className="animate-spin" /> : "Verify"}
                        </button>
                    </div>
                </div>
                
                {/* Autocomplete Dropdown */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1">
                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 flex items-center">
                            <Search size={10} className="mr-1"/> Suggested Locations
                        </div>
                        {locationSuggestions.map((suggestion, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => {
                                    setFormData(prev => ({ ...prev, location: suggestion }));
                                    setShowLocationSuggestions(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center border-b border-gray-50 last:border-0"
                            >
                                <MapPin size={14} className="mr-2 text-gray-400" />
                                {suggestion}
                            </button>
                        ))}
                    </div>
                )}
                
                <InputError name="location" touched={touched} errors={errors} />
              </div>
            </div>
          </section>

          {/* Section 2: Technical Specs / Property Details */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center border-b pb-2">
              <Wand2 className="mr-2 text-purple-600" /> {formData.type === AuctionType.AUTOMOBILE ? 'Technical Specifications' : 'Property Details'}
            </h2>
            
            {formData.type === AuctionType.AUTOMOBILE ? (
                // --- CAR SPECS ---
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Odometer (Miles) *</label>
                            <input
                            type="number"
                            name="mileage"
                            value={formData.mileage}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.mileage ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                            />
                            <InputError name="mileage" touched={touched} errors={errors} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transmission *</label>
                            <select
                            name="transmission"
                            value={formData.transmission}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.transmission ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                            >
                            <option value="">Select Type</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="CVT">CVT</option>
                            <option value="Dual Clutch">Dual Clutch (DCT)</option>
                            </select>
                            <InputError name="transmission" touched={touched} errors={errors} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                            <select
                            name="bodyType"
                            value={formData.bodyType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                            <option value="">Select Body</option>
                            <option value="Sedan">Sedan</option>
                            <option value="Coupe">Coupe</option>
                            <option value="SUV">SUV</option>
                            <option value="Truck">Truck</option>
                            <option value="Convertible">Convertible</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="Wagon">Wagon</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                            <select
                            name="fuelType"
                            value={formData.fuelType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                            <option value="">Select Fuel</option>
                            <option value="Gasoline">Gasoline</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Engine Type</label>
                            <input
                            type="text"
                            name="engine"
                            value={formData.engine}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="e.g. 4.0L Flat-6"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Drivetrain</label>
                            <select
                            name="drivetrain"
                            value={formData.drivetrain}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                            <option value="">Select Drivetrain</option>
                            <option value="RWD">Rear-Wheel Drive (RWD)</option>
                            <option value="FWD">Front-Wheel Drive (FWD)</option>
                            <option value="AWD">All-Wheel Drive (AWD)</option>
                            <option value="4WD">Four-Wheel Drive (4x4)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Exterior Color</label>
                            <input
                            type="text"
                            name="exteriorColor"
                            value={formData.exteriorColor}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Shark Blue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Interior Color</label>
                            <input
                            type="text"
                            name="interiorColor"
                            value={formData.interiorColor}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Black w/ Blue Stitching"
                            />
                        </div>
                    </div>
                </>
            ) : (
                // --- PROPERTY SPECS ---
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Square Footage *</label>
                        <input
                            type="number"
                            name="sqft"
                            value={formData.sqft}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.sqft ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                            placeholder="2500"
                        />
                        <InputError name="sqft" touched={touched} errors={errors} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lot Size (Acres)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="lotSize"
                            value={formData.lotSize}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="0.5"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                        <select
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select</option>
                            {[0,1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
                            <option value="9+">9+</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                        <select
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">Select</option>
                            {[1,1.5,2,2.5,3,3.5,4,4.5,5].map(n => <option key={n} value={n}>{n}</option>)}
                            <option value="6+">6+</option>
                        </select>
                    </div>
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">HOA Fees (Monthly)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input
                                type="number"
                                name="hoaFees"
                                value={formData.hoaFees}
                                onChange={handleChange}
                                className="w-full pl-6 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            )}
          </section>

          {/* Section 3: Condition & History */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center border-b pb-2">
              <CheckCircle className="mr-2 text-green-600" /> Condition & History
            </h2>

            <div className="grid grid-cols-1 gap-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{formData.type === AuctionType.AUTOMOBILE ? 'Vehicle Condition' : 'Property Condition'}</label>
                      <select
                        name="conditionRating"
                        value={formData.conditionRating}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                        {formData.type === AuctionType.PROPERTY && <option value="Fixer-Upper">Fixer-Upper</option>}
                      </select>
                   </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Condition Description</label>
                  <textarea
                    rows={4}
                    name="conditionDescription"
                    value={formData.conditionDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Describe any flaws, scratches, or issues..."
                  />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {formData.type === AuctionType.AUTOMOBILE && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Accident History</label>
                        <div className="flex space-x-4 mt-2">
                        <label className="inline-flex items-center">
                            <input type="radio" name="accidentHistory" value="No" checked={formData.accidentHistory === 'No'} onChange={handleChange} className="form-radio h-5 w-5 text-blue-600"/>
                            <span className="ml-2 text-gray-700">No Accidents</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" name="accidentHistory" value="Yes" checked={formData.accidentHistory === 'Yes'} onChange={handleChange} className="form-radio h-5 w-5 text-blue-600"/>
                            <span className="ml-2 text-gray-700">Has Accident History</span>
                        </label>
                        </div>
                    </div>
                 )}
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{formData.type === AuctionType.AUTOMOBILE ? "Maintenance Records" : "Inspection Reports"}</label>
                    <div className="relative border border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                       <input 
                         type="file" 
                         accept=".pdf,.png,.jpg,.jpeg"
                         onChange={handleMaintenanceUpload}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       />
                       <Upload size={20} className="text-gray-400 mr-2" />
                       <span className="text-sm text-gray-600">
                           {formData.maintenanceRecords ? formData.maintenanceRecords : "Upload PDF or Images"}
                       </span>
                    </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{formData.type === AuctionType.AUTOMOBILE ? "Recent Service" : "Recent Upgrades/Renovations"}</label>
                    <input
                      type="text"
                      name="recentService"
                      value={formData.recentService}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder={formData.type === AuctionType.AUTOMOBILE ? "e.g. Oil change, New Tires" : "e.g. New Roof 2022, Kitchen Remodel"}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{formData.type === AuctionType.AUTOMOBILE ? "Modifications" : "Features/Amenities"}</label>
                    <input
                      type="text"
                      name="modifications"
                      value={formData.modifications}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder={formData.type === AuctionType.AUTOMOBILE ? "e.g. Aftermarket Exhaust" : "e.g. Pool, Solar Panels"}
                    />
                  </div>
               </div>
            </div>
          </section>

          {/* Section 4: Auction Settings */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center border-b pb-2">
              <Calendar className="mr-2 text-orange-600" /> Auction Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date/Time</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                 <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="3">3 Days</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days</option>
                  <option value="10">10 Days</option>
                  <option value="14">14 Days</option>
                </select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starting Bid ($) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="startingPrice"
                      value={formData.startingPrice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-6 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.startingPrice ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                    />
                  </div>
                  <InputError name="startingPrice" touched={touched} errors={errors} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reserve Price ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="reservePrice"
                      value={formData.reservePrice}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-6 pr-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${errors.reservePrice ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'}`}
                      placeholder="Hidden minimum"
                    />
                  </div>
                  <InputError name="reservePrice" touched={touched} errors={errors} />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buy-It-Now Price ($)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="buyItNowPrice"
                      value={formData.buyItNowPrice}
                      onChange={handleChange}
                      className="w-full pl-6 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Optional"
                    />
                  </div>
               </div>
            </div>
            
            <div className="bg-white p-1 rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-sm">
                <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
                    <label className="text-sm font-bold text-gray-700 flex items-center">
                        Description
                        <span className="ml-2 text-xs font-normal text-gray-400 hidden sm:inline">(Auto-generated or custom)</span>
                    </label>
                    <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={aiLoading}
                        className="group flex items-center text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 hover:shadow-sm border border-purple-200 px-3 py-1.5 rounded-full transition-all"
                    >
                        {aiLoading ? <Loader2 size={12} className="animate-spin mr-1.5" /> : <Wand2 size={12} className="mr-1.5 group-hover:rotate-12 transition-transform" />}
                        {aiLoading ? 'Generating...' : 'AI Generate'}
                    </button>
                </div>
                <textarea
                    rows={6}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm text-gray-700 bg-transparent border-none focus:ring-0 placeholder-gray-400"
                    placeholder="Describe the condition, features, and history of your asset..."
                />
            </div>

            <div className="pt-4">
               <label className="flex items-start">
                  <input 
                    type="checkbox" 
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    className="mt-1 form-checkbox h-5 w-5 text-blue-600 rounded" 
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the Autobid Seller Terms & Conditions. I certify that the information provided is accurate and I have the legal right to sell this asset.
                  </span>
               </label>
               <InputError name="termsAccepted" touched={touched} errors={errors} />
            </div>
          </section>

          <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
            <button
               type="button"
               onClick={() => navigate('/dashboard')}
               className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium bg-gray-100 rounded-lg transition-colors"
            >
               Cancel
            </button>
            <button
               type="submit"
               disabled={loading}
               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-blue-900/30 transition-all transform active:scale-95 flex items-center"
            >
               {loading && <Loader2 size={18} className="animate-spin mr-2" />}
               Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAuction;