import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";
import UseAxios from "@/assets/hooks/use-axios";
import { API_URL } from "@/assets/api-endpoints";


export const fetchServices = () =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_SERVICES}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const fetchPatient = () =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_PATIENT}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const fetchPatientById = (patient_id) =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.FETCH_PATIENT_BY_ID}`, {
            params: {
                patient_id: patient_id
            }
        })
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}


export const searchPatients = (first_name) =>{
    return new Promise((resolve,reject) =>{
        console.log("PATIENT_URL ",`${APP_API_URL.SEARCH_PATIENT}`)
        axios.get(`${APP_API_URL.SEARCH_PATIENT}`,{
            params:{
                first_name:first_name,
            }
        })
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const fetchPatientProfile = (userId) =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.GET_PATIENT_PROFILE}`,{
            params:{
                userId: userId
            }
        })
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const createPatient = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.CREATE_PATIENT}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const editPatient = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.put(`${APP_API_URL.EDIT_PATIENT}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                console.log("EDIT_ERROR ",err)
                reject(err.message)
            })
    })
}

export const deletePatient = (id) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.DELETE_PATIENT}`,{id})
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                console.log("DELETE_ERROR ",err)
                reject(err.message)
            })
    })
}


export const prescribePatient = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.PRESCRIBE}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const assignDoctor = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.ASSIGN_DOCTOR}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}


export const consultPatient = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.CONSULT_PATIENT}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const referPatient = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.REFER_PATIENT}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const prescribeDrug = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.PRESCRIBE_DRUG}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const updatePrescribeDrug = (payload, auth) =>{
    const axiosInstance = UseAxios(auth);
    return new Promise((resolve,reject) =>{
        axiosInstance.patch(`${APP_API_URL.PRESCRIBE_DRUG}`,payload)
        .then((res) =>{
            resolve(res.data)
        })
        .catch((err) =>{
            reject(err.message)
        })
    })
}

export const createPrescription = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.CREATE_PRESCRIPTION}`,payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const updatePrescription = (prescription_id, payload, auth) =>{
    return new Promise((resolve,reject) =>{
        axios.patch(`${APP_API_URL.CREATE_PRESCRIPTION}`,payload, {
            params: {
                prescription_id: prescription_id
            }, auth
        })
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const fetchPatientTriage = (id) =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.GET_PATIENT_TRIAGE}`,{
            params:{
                id: id
            }
        })
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

// export const updatePatientTriage = (id, payload, auth) =>{
//     console.log(id)
//     return new Promise((resolve,reject) =>{
//         axios.patch(`${APP_API_URL.ADD_TRIAGE}${id}`,payload,{
//             params:{
//                 id: id
//             }, auth
//         })
//             .then((res) =>{
//                 resolve(res.data)
//             })
//             .catch((err) =>{
//                 reject(err.message)
//             })
//     })
// }

export const updatePatientTriage = (id, payload, auth) => {
    return new Promise((resolve, reject) => {
        // Fix the URL construction
        const url = `http://localhost:8080${API_URL.ADD_TRIAGE}${id}/`;
        console.log('Making triage request to:', url);
        
        axios.patch(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                console.error('Triage update error:', err.response?.data);
                reject(err.response?.data || err.message);
            });
    });
};


export const fetchPatientPrescribeDrugs = (patient_id) =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.PRESCRIBE_DRUG_BY_PATIENT_ID}`,{
            params:{
                patient_id: patient_id
            }
        })
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const fetchAllAttendanceProcesses = () =>{
    return new Promise((resolve,reject) =>{
        axios.get(`${APP_API_URL.PATIENT_ATTENDANCE_PROCESS}`)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const initiateNewAttendanceProcesses = (payload) =>{
    return new Promise((resolve,reject) =>{
        axios.post(`${APP_API_URL.PATIENT_ATTENDANCE_PROCESS}`, payload)
            .then((res) =>{
                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })
}

export const updateAttendanceProcesses = (payload, process_id) => {
    return new Promise((resolve,reject) =>{
        axios.patch(`${APP_API_URL.PATIENT_ATTENDANCE_PROCESS}`, payload, {
            params: {
                process_id: process_id
            }
        })
            .then((res) =>{
        

                resolve(res.data)
            })
            .catch((err) =>{
                reject(err.message)
            })
    })


    
}


export const sendPatientToTriage = (payload, process_id) => {
    return new Promise((resolve, reject) => {
        // Use APP_API_URL instead of constructing the URL manually
        if (!process_id) {
            console.error('No process ID provided');
            reject(new Error('Process ID is required'));
            return;
        }
        const url = `http://localhost:8080${API_URL.PATIENT_ATTENDANCE_PROCESS}${process_id}/`;
        console.log('Making request to:', url);
        
        axios.patch(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            // Remove withCredentials since we're using CORS_ALLOW_ALL_ORIGINS
            withCredentials: false
        })
            .then((res) => {
                console.log('Success response:', res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error('Full error object:', err);
                console.error('Error response data:', err.response?.data);
                console.error('Error status:', err.response?.status);
                reject(err.response?.data || err.message);
            });
    });
};


// export const sendPatientToTriage = (payload, process_id) => {
//     return new Promise((resolve, reject) => {
//         const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://backend:8080';
//         const url = `${baseUrl}${API_URL.PATIENT_ATTENDANCE_PROCESS}${process_id}/`;
        
//         axios.patch(url, payload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 'x-handle-backend': 'true',
//             },
//             withCredentials: true
//         })
//             .then((res) => {
//                 console.log('Success response:', res.data);
//                 resolve(res.data);
//             })
//             .catch((err) => {
//                 console.error('Full error object:', err);
//                 console.error('Error response data:', err.response?.data);
//                 console.error('Error status:', err.response?.status);
//                 reject(err.response?.data || err.message);
//             });
//     });
// };

// Add this new function for nurse assignment
// export const sendPatientToTriage = (payload, process_id) => {
//     return new Promise((resolve, reject) => {
//         const url = `${API_URL.PATIENT_ATTENDANCE_PROCESS}${process_id}/`;
//         console.log('Making request to:', url);
        
//         axios.patch(url, payload)
//             .then((res) => {
//                 console.log('Success response:', res.data);
//                 resolve(res.data);
//             })
//             .catch((err) => {
//                 console.error('Full error object:', err);
//                 console.error('Error response data:', err.response?.data);
//                 console.error('Error status:', err.response?.status);
//                 reject(err.response?.data || err.message);
//             });
//     });
// };

// export const updatePatientAttendanceProcess = async (payload, processId) => {
//     try {
//         const response = await axios.patch(
//             `${API_URL.UPDATE_ATTENDANCE_PROCESS}${processId}/`,
//             payload
//         );
//         return response.data;
//     } catch (error) {
//         console.error('Attendance process update error:', error.response?.data);
//         throw error;
//     }
// };


export const patientNextOfKin = (payload) => {
    return new Promise ((resolve, reject) => {
        axios.post(`${APP_API_URL.PATIENT_KIN}`, payload)
        .then((res)=> {
            resolve(res.data)
        })
        .catch((err)=> {
            reject(err.message)
        })
    })
}

export const patientNextOfKinContact = (payload) => {
    return new Promise ((resolve, reject) => {
        axios.post(`${APP_API_URL.PATIENT_KIN_CONTACT}`, payload)
        .then((res)=> {
            resolve(res.data)
        })
        .catch((err)=> {
            reject(err.message)
        })
    })
}