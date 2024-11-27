import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import { updateAttendanceProcesses } from "@/redux/service/patients";
import { getPatientTriage } from "@/redux/features/patients";
import { toast } from "react-toastify";
import { updatePatientTriage} from "@/redux/service/patients";
// import { updatePatientAttendanceProcess } from "@/redux/service/patients";

export default function AssignNurseModal({ assignNurseOpen, setAssignNurseOpen, selectedData }) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleClose = () => {
        setAssignNurseOpen(false);
    };

    // const handleSendToTriage = async () => {
    //     try {
    //         setLoading(true);
    //         const payload = {
    //             track: "triage",
    //             triage: {
    //                 created_by: "reception",
    //                 temperature: 0,    // Changed from null to 0
    //                 height: 0,         // Changed from null to 0
    //                 weight: 0,         // Changed from null to 0
    //                 pulse: 0,          // Changed from null to 0
    //                 systolic: 0,       // Changed from null to 0
    //                 diastolic: 0,      // Changed from null to 0
    //                 bmi: 0,            // Changed from null to 0
    //                 notes: ""
    //             }
    //         };
            
    //         console.log('About to send triage data:', payload);
    //         const response = await updatePatientTriage(payload, selectedData.id);
    //         console.log('Triage response:', response);
    //         dispatch(getAllProcesses());
    //         toast.success("Patient sent to triage successfully");
    //         handleClose();
    //     } catch (error) {
    //         console.error("Error details:", {
    //             message: error.message,
    //             response: error.response,
    //             data: error.response?.data
    //         });
            
    //         let errorMessage = "Failed to send patient to triage";
    //         if (typeof error === 'string') {
    //             errorMessage = error;
    //         } else if (error.response?.data?.error) {
    //             errorMessage = error.response.data.error;
    //         }
            
    //         toast.error(errorMessage);
    //     } finally {
    //         setLoading(false);
    //     }
    // };



    const handleSendToTriage = async () => {
        try {
            setLoading(true);
            const payload = {
                track: "triage",
                triage: {
                    created_by: "reception",
                    temperature: 0,
                    height: 0,
                    weight: 0,
                    pulse: 0,
                    systolic: 0,
                    diastolic: 0,
                    bmi: 0,
                    notes: ""
                }
            };
            
            // First update the attendance process
            console.log('Sending to nurse with payload:', payload);

            const response = await updateAttendanceProcesses(payload, selectedData.id);
            console.log('Update response:', response);

            // Then update the triage data
            const triageResponse = await updatePatientTriage(selectedData.triage, payload.triage);
            console.log('Triage response:', triageResponse);
            
            dispatch(getPatientTriage(selectedData.id));
            toast.success("Patient sent to triage successfully");
            handleClose();
        } catch (error) {
            console.error("Error details:", error);
            toast.error(error.message || "Failed to send patient to triage");
        } finally {
            setLoading(false);
        }
    };

    
    return (
        <Dialog
            open={assignNurseOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>
                <p className="text-sm font-semibold">
                    {`Send ${selectedData?.patient_name} to Triage`}
                </p>
            </DialogTitle>
            <DialogContent>
                <section className="space-y-4">
                    <p className="mt-4">
                        Are you sure you want to send this patient for triage?
                    </p>

                    <div className="flex items-center gap-2 justify-end mt-6">
                        <button
                            className="border border-warning text-sm rounded-xl px-3 py-2"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSendToTriage}
                            className="bg-primary px-3 py-2 text-sm text-white rounded-xl"
                            disabled={loading}
                        >
                            {loading ? (
                                <svg
                                    aria-hidden="true"
                                    role="status"
                                    className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    ></path>
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="#1C64F2"
                                    ></path>
                                </svg>
                            ) : null}
                            Send to Triage
                        </button>
                    </div>
                </section>
            </DialogContent>
        </Dialog>
    );
}