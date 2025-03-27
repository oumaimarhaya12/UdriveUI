"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import "../styles/SignupForm.css"

// List of common nationalities
const NATIONALITIES = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Argentine",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bahamian",
  "Bahraini",
  "Bangladeshi",
  "Barbadian",
  "Belarusian",
  "Belgian",
  "Belizean",
  "Beninese",
  "Bhutanese",
  "Bolivian",
  "Bosnian",
  "Brazilian",
  "British",
  "Bulgarian",
  "Burkinabe",
  "Burmese",
  "Burundian",
  "Cambodian",
  "Cameroonian",
  "Canadian",
  "Cape Verdean",
  "Central African",
  "Chadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Comoran",
  "Congolese",
  "Costa Rican",
  "Croatian",
  "Cuban",
  "Cypriot",
  "Czech",
  "Danish",
  "Djiboutian",
  "Dominican",
  "Dutch",
  "Ecuadorian",
  "Egyptian",
  "Emirati",
  "Equatorial Guinean",
  "Eritrean",
  "Estonian",
  "Ethiopian",
  "Fijian",
  "Filipino",
  "Finnish",
  "French",
  "Gabonese",
  "Gambian",
  "Georgian",
  "German",
  "Ghanaian",
  "Greek",
  "Grenadian",
  "Guatemalan",
  "Guinean",
  "Guyanese",
  "Haitian",
  "Honduran",
  "Hungarian",
  "Icelandic",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Ivorian",
  "Jamaican",
  "Japanese",
  "Jordanian",
  "Kazakhstani",
  "Kenyan",
  "Korean",
  "Kuwaiti",
  "Kyrgyz",
  "Laotian",
  "Latvian",
  "Lebanese",
  "Liberian",
  "Libyan",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malagasy",
  "Malawian",
  "Malaysian",
  "Maldivian",
  "Malian",
  "Maltese",
  "Mauritanian",
  "Mauritian",
  "Mexican",
  "Moldovan",
  "Monacan",
  "Mongolian",
  "Montenegrin",
  "Moroccan",
  "Mozambican",
  "Namibian",
  "Nepalese",
  "New Zealand",
  "Nicaraguan",
  "Nigerian",
  "Norwegian",
  "Omani",
  "Pakistani",
  "Panamanian",
  "Papua New Guinean",
  "Paraguayan",
  "Peruvian",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Rwandan",
  "Saint Lucian",
  "Salvadoran",
  "Samoan",
  "Saudi",
  "Senegalese",
  "Serbian",
  "Seychellois",
  "Sierra Leonean",
  "Singaporean",
  "Slovak",
  "Slovenian",
  "Somali",
  "South African",
  "Spanish",
  "Sri Lankan",
  "Sudanese",
  "Surinamese",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Tajik",
  "Tanzanian",
  "Thai",
  "Togolese",
  "Trinidadian",
  "Tunisian",
  "Turkish",
  "Turkmen",
  "Ugandan",
  "Ukrainian",
  "Uruguayan",
  "Uzbek",
  "Venezuelan",
  "Vietnamese",
  "Yemeni",
  "Zambian",
  "Zimbabwean",
]

const SignupForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    nationality: "",
    email: "",
    phoneNumber: "", // Changed from phone to phoneNumber to match backend
    password: "",
    confirmPassword: "",
    driverLicense: false, // Changed from hasDriverLicense to driverLicense to match backend
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordStrength, setPasswordStrength] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecial: false,
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    // Check password strength
    if (name === "password") {
      setPasswordStrength({
        hasLowercase: /[a-z]/.test(value),
        hasUppercase: /[A-Z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required"
    } else if (isNaN(formData.age) || Number.parseInt(formData.age) < 18) {
      newErrors.age = "You must be at least 18 years old"
    }

    // Nationality validation
    if (!formData.nationality) {
      newErrors.nationality = "Nationality is required"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    // Phone validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (
      !/[a-z]/.test(formData.password) ||
      !/[A-Z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)
    ) {
      newErrors.password = "Password must contain lowercase, uppercase, number and special character"
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    // Driver license validation
    if (!formData.driverLicense) {
      newErrors.driverLicense = "You must have a driver license to register"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Prepare data for backend - map field names to match backend DTO
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: Number.parseInt(formData.age),
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        nationality: formData.nationality,
        driverLicense: formData.driverLicense,
      }

      console.log("Sending user data to backend:", userData)

      // Call the backend API with improved CORS handling
      const response = await fetch("http://localhost:8084/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      // Check if the response has content
      const contentType = response.headers.get("content-type")
      console.log("Content type:", contentType)

      if (!response.ok) {
        // Try to parse error response if it exists
        let errorMessage = "Registration failed"

        if (contentType && contentType.includes("application/json")) {
          const errorText = await response.text()
          console.log("Error response text:", errorText)

          if (errorText && errorText.trim() !== "") {
            try {
              const errorData = JSON.parse(errorText)
              errorMessage = errorData.message || errorMessage
            } catch (parseError) {
              console.error("Error parsing error response:", parseError)
            }
          }
        }

        throw new Error(errorMessage)
      }

      // Check if there's a response body to parse
      if (contentType && contentType.includes("application/json")) {
        const responseText = await response.text()
        console.log("Response text:", responseText)

        if (responseText && responseText.trim() !== "") {
          const createdUser = JSON.parse(responseText)
          console.log("User created successfully:", createdUser)
        } else {
          console.log("Empty response body but status OK")
        }
      } else {
        console.log("Response is not JSON, but status is OK")
      }

      // Redirect to login page after successful registration
      navigate("/login")
    } catch (error) {
      console.error("Registration error:", error)
      setErrors({ form: error.message || "Registration failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-form-container">
      <div className="signup-form-wrapper">
        <div className="form-header">
          <h1>Create Account</h1>
          <p>Join Udrive and start your journey</p>
        </div>

        {errors.form && <div className="error-message">{errors.form}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Personal Information */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <div className="input-wrapper">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <div className="field-error">{errors.firstName}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <div className="input-wrapper">
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <div className="field-error">{errors.lastName}</div>}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <div className="input-wrapper">
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="18"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                />
                {errors.age && <div className="field-error">{errors.age}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="nationality">Nationality</label>
              <div className="select-wrapper">
                <select
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="nationality-select"
                >
                  <option value="">Select your nationality</option>
                  {NATIONALITIES.map((nationality) => (
                    <option key={nationality} value={nationality}>
                      {nationality}
                    </option>
                  ))}
                </select>
                {errors.nationality && <div className="field-error">{errors.nationality}</div>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="input-wrapper">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && <div className="field-error">{errors.phoneNumber}</div>}
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
                {errors.password && <div className="field-error">{errors.password}</div>}
              </div>

              <div className="password-strength">
                <div className={`strength-item ${passwordStrength.hasLowercase ? "valid" : ""}`}>
                  <span className="strength-icon">{passwordStrength.hasLowercase ? "✓" : "○"}</span>
                  <span>One lowercase letter</span>
                </div>
                <div className={`strength-item ${passwordStrength.hasUppercase ? "valid" : ""}`}>
                  <span className="strength-icon">{passwordStrength.hasUppercase ? "✓" : "○"}</span>
                  <span>One uppercase letter</span>
                </div>
                <div className={`strength-item ${passwordStrength.hasNumber ? "valid" : ""}`}>
                  <span className="strength-icon">{passwordStrength.hasNumber ? "✓" : "○"}</span>
                  <span>One number</span>
                </div>
                <div className={`strength-item ${passwordStrength.hasSpecial ? "valid" : ""}`}>
                  <span className="strength-icon">{passwordStrength.hasSpecial ? "✓" : "○"}</span>
                  <span>One special character</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
              </div>
            </div>
          </div>

          {/* Driver License Checkbox */}
          <div className="form-group checkbox-group">
            <div className="checkbox-wrapper">
              <input
                id="driverLicense"
                name="driverLicense"
                type="checkbox"
                checked={formData.driverLicense}
                onChange={handleChange}
              />
              <label htmlFor="driverLicense" className="checkbox-label">
                I confirm that I have a valid driver license
              </label>
            </div>
            {errors.driverLicense && <div className="field-error">{errors.driverLicense}</div>}
          </div>

          <button type="submit" className={`signup-button ${loading ? "loading" : ""}`} disabled={loading}>
            {loading ? <span className="spinner"></span> : "Create Account"}
          </button>

          <div className="login-link">
            <span>Already have an account?</span>
            <Link to="/login" className="login-link-text">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupForm