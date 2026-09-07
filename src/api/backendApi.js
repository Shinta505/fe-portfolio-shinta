import axiosInstance from './axiosConfig';

/**
 * ==========================================
 * 1. AUTHENTICATION API[cite: 1]
 * ==========================================
 */
export const loginAdmin = async(credentials) => {
    return await axiosInstance.post('/login', credentials);
};

export const getCurrentAdmin = async() => {
    return await axiosInstance.get('/me');
};

export const logoutAdmin = async() => {
    return await axiosInstance.delete('/logout');
};

/**
 * ==========================================
 * 2. PROFILE API[cite: 1]
 * ==========================================
 */
export const getProfile = async() => {
    return await axiosInstance.get('/profile');
};

export const updateProfile = async(profileData) => {
    return await axiosInstance.put('/profile', profileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const uploadImage = async(formData) => {
    return await axiosInstance.post('/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

/**
 * ==========================================
 * 3. PROJECT API (GALERI KARYA)[cite: 1]
 * ==========================================
 */
export const getProjects = async(category = 'All') => {
    const params = category !== 'All' ? { category } : {};
    return await axiosInstance.get('/projects', { params });
};

export const getProjectByIdOrSlug = async(identifier) => {
    return await axiosInstance.get(`/projects/${identifier}`);
};

export const createProject = async(formData) => {
    return await axiosInstance.post('/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateProject = async(uuid, formData) => {
    return await axiosInstance.put(`/projects/${uuid}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteProject = async(uuid) => {
    return await axiosInstance.delete(`/projects/${uuid}`);
};

/**
 * ==========================================
 * 4. ARTICLE API (BLOG & ARTIKEL)[cite: 1]
 * ==========================================
 */
export const getArticles = async(status = '') => {
    const params = status ? { status } : {};
    return await axiosInstance.get('/articles', { params });
};

export const getArticleByIdOrSlug = async(identifier) => {
    return await axiosInstance.get(`/articles/${identifier}`);
};

export const createArticle = async(formData) => {
    return await axiosInstance.post('/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateArticle = async(uuid, formData) => {
    return await axiosInstance.put(`/articles/${uuid}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteArticle = async(uuid) => {
    return await axiosInstance.delete(`/articles/${uuid}`);
};

/**
 * ==========================================
 * 5. CONTACT API (FORMULIR KONTAK)[cite: 1]
 * ==========================================
 */
export const sendContactMessage = async(messageData) => {
    return await axiosInstance.post('/contact', messageData);
};

export const getContactMessages = async() => {
    return await axiosInstance.get('/contacts');
};

export const getContactMessageById = async(uuid) => {
    return await axiosInstance.get(`/contacts/${uuid}`);
};

export const deleteContactMessage = async(uuid) => {
    return await axiosInstance.delete(`/contacts/${uuid}`);
};

/**
 * ==========================================
 * 6. RESUME / CV API[cite: 1]
 * ==========================================
 */
export const getAllResumes = async() => {
    return await axiosInstance.get('/resumes');
};

export const getActiveResume = async() => {
    return await axiosInstance.get('/resumes/active');
};

export const createResume = async(resumeData) => {
    return await axiosInstance.post('/resumes', resumeData);
};

export const updateResume = async(uuid, resumeData) => {
    return await axiosInstance.put(`/resumes/${uuid}`, resumeData);
};

export const setActiveResume = async(uuid) => {
    return await axiosInstance.patch(`/resumes/${uuid}/active`);
};

export const deleteResume = async(uuid) => {
    return await axiosInstance.delete(`/resumes/${uuid}`);
};

/**
 * ==========================================
 * 7. EXPERIENCE API (RIWAYAT PEKERJAAN)[cite: 1]
 * ==========================================
 */
export const getExperiences = async() => {
    return await axiosInstance.get('/experiences');
};

export const getExperienceById = async(id) => {
    return await axiosInstance.get(`/experiences/${id}`);
};

export const createExperience = async(experienceData) => {
    return await axiosInstance.post('/experiences', experienceData);
};

export const updateExperience = async(id, experienceData) => {
    return await axiosInstance.patch(`/experiences/${id}`, experienceData);
};

export const deleteExperience = async(id) => {
    return await axiosInstance.delete(`/experiences/${id}`);
};

/**
 * ==========================================
 * 8. EDUCATION API (RIWAYAT PENDIDIKAN)[cite: 1]
 * ==========================================
 */
export const getEducations = async() => {
    return await axiosInstance.get('/educations');
};

export const getEducationById = async(id) => {
    return await axiosInstance.get(`/educations/${id}`);
};

export const createEducation = async(educationData) => {
    return await axiosInstance.post('/educations', educationData);
};

export const updateEducation = async(id, educationData) => {
    return await axiosInstance.patch(`/educations/${id}`, educationData);
};

export const deleteEducation = async(id) => {
    return await axiosInstance.delete(`/educations/${id}`);
};

/**
 * ==========================================
 * 9. CERTIFICATION API (SERTIFIKASI)[cite: 1]
 * ==========================================
 */
export const getCertifications = async() => {
    return await axiosInstance.get('/certifications');
};

export const getCertificationById = async(id) => {
    return await axiosInstance.get(`/certifications/${id}`);
};

export const createCertification = async(certificationData) => {
    return await axiosInstance.post('/certifications', certificationData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateCertification = async(id, certificationData) => {
    return await axiosInstance.patch(`/certifications/${id}`, certificationData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteCertification = async(id) => {
    return await axiosInstance.delete(`/certifications/${id}`);
};

/**
 * ==========================================
 * 10. SKILL API (KEAHLIAN & TEKNOLOGI)[cite: 1]
 * ==========================================
 */
export const getSkills = async() => {
    return await axiosInstance.get('/skills');
};

export const getSkillById = async(uuid) => {
    return await axiosInstance.get(`/skills/${uuid}`);
};

export const createSkill = async(skillData) => {
    return await axiosInstance.post('/skills', skillData);
};

export const updateSkill = async(uuid, skillData) => {
    return await axiosInstance.patch(`/skills/${uuid}`, skillData);
};

export const deleteSkill = async(uuid) => {
    return await axiosInstance.delete(`/skills/${uuid}`);
};