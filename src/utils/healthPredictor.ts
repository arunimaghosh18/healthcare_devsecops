
interface HealthProblem {
  problem: string;
  specialization: string;
}

const symptomsMap: Record<string, HealthProblem[]> = {
  headache: [
    { problem: 'Migraine', specialization: 'Neurology' },
    { problem: 'Tension Headache', specialization: 'Neurology' },
    { problem: 'Sinusitis', specialization: 'ENT Specialist' }
  ],
  fever: [
    { problem: 'Viral Infection', specialization: 'Internal Medicine' },
    { problem: 'Bacterial Infection', specialization: 'Infectious Disease' },
    { problem: 'Malaria', specialization: 'Infectious Disease' }
  ],
  cough: [
    { problem: 'Common Cold', specialization: 'General Medicine' },
    { problem: 'Bronchitis', specialization: 'Pulmonology' },
    { problem: 'Asthma', specialization: 'Pulmonology' }
  ],
  "joint pain": [
    { problem: 'Arthritis', specialization: 'Rheumatology' },
    { problem: 'Osteoporosis', specialization: 'Orthopedic' },
    { problem: 'Gout', specialization: 'Rheumatology' }
  ],
  "chest pain": [
    { problem: 'Angina', specialization: 'Cardiology' },
    { problem: 'Heart Disease', specialization: 'Cardiology' },
    { problem: 'Muscle Strain', specialization: 'Physical Medicine' }
  ],
  "stomach pain": [
    { problem: 'Gastritis', specialization: 'Gastroenterology' },
    { problem: 'Ulcer', specialization: 'Gastroenterology' },
    { problem: 'Appendicitis', specialization: 'General Surgery' }
  ],
  "skin rash": [
    { problem: 'Eczema', specialization: 'Dermatology' },
    { problem: 'Psoriasis', specialization: 'Dermatology' },
    { problem: 'Allergic Reaction', specialization: 'Allergist' }
  ],
  "eye problem": [
    { problem: 'Glaucoma', specialization: 'Ophthalmology' },
    { problem: 'Cataract', specialization: 'Ophthalmology' },
    { problem: 'Conjunctivitis', specialization: 'Ophthalmology' }
  ],
  "mental health": [
    { problem: 'Depression', specialization: 'Psychiatry' },
    { problem: 'Anxiety', specialization: 'Psychiatry' },
    { problem: 'Stress', specialization: 'Psychology' }
  ],
  "diabetes": [
    { problem: 'Type 1 Diabetes', specialization: 'Endocrinology' },
    { problem: 'Type 2 Diabetes', specialization: 'Endocrinology' },
    { problem: 'Gestational Diabetes', specialization: 'Endocrinology' }
  ],
  "ear pain": [
    { problem: 'Ear Infection', specialization: 'ENT Specialist' },
    { problem: 'Tinnitus', specialization: 'ENT Specialist' },
    { problem: 'Hearing Loss', specialization: 'Audiologist' }
  ],
  "back pain": [
    { problem: 'Herniated Disc', specialization: 'Orthopedic' },
    { problem: 'Muscle Sprain', specialization: 'Physical Medicine' },
    { problem: 'Sciatica', specialization: 'Neurology' }
  ],
  "pregnancy": [
    { problem: 'Regular Checkup', specialization: 'Obstetrics & Gynecology' },
    { problem: 'High Risk Pregnancy', specialization: 'Obstetrics & Gynecology' },
    { problem: 'Gestational Issues', specialization: 'Obstetrics & Gynecology' }
  ]
};

export const predictHealth = (symptoms: string): HealthProblem[] => {
  const lowercaseSymptoms = symptoms.toLowerCase();
  const predictions: HealthProblem[] = [];
  
  Object.entries(symptomsMap).forEach(([symptom, problems]) => {
    if (lowercaseSymptoms.includes(symptom)) {
      predictions.push(...problems);
    }
  });
  
  return predictions.length > 0 ? predictions : [{ 
    problem: 'General Check-up', 
    specialization: 'General Medicine' 
  }];
};

export const getAllSpecializations = (): string[] => {
  const specializations = new Set<string>();
  Object.values(symptomsMap).forEach(problems => {
    problems.forEach(problem => {
      specializations.add(problem.specialization);
    });
  });
  return Array.from(specializations).sort();
};

