"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, X } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAppRequest";
import {
    checkPatientExistsOnServer,
    createPatient,
    getMyPatients,
} from "@/actions/patient_relation";

interface PatientWithUserNames {
    id: string;
    medicalId: string;
    patientId: string;
    medicalUser?: { id: string; name?: string | null };
    patientUser?: {
        id: string;
        name?: string | null;
        gender?: string | null;
        dateBirth?: string | null; // ou dataNascimento conforme backend
    };
}

export default function StandalonePatientListDemo() {
    const user = useCurrentUser();
    const router = useRouter();

    if (!user) {
        return (
            <div className="text-center text-gray-500">Carregando informações do usuário...</div>
        );
    }

    const [patients, setPatients] = useState<PatientWithUserNames[]>([]);
    const [isLoadingPatients, setIsLoadingPatients] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [patientIdInput, setPatientIdInput] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        const fetchPatients = async () => {
            setIsLoadingPatients(true);
            try {
                const result = await getMyPatients(user.id!); // <-- "!" aqui, pois já garantimos com o if
                setPatients(result);
            } catch (err) {
                console.error("Erro ao buscar pacientes:", err);
            } finally {
                setIsLoadingPatients(false);
            }
        };

        fetchPatients();
    }, [user?.id]);

    const openModal = useCallback(() => {
        setIsModalOpen(true);
        setErrorMessage("");
        setPatientIdInput("");
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setPatientIdInput("");
        setErrorMessage("");
        setIsLoadingSubmit(false);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (patientIdInput.trim()) {
            setIsLoadingSubmit(true);
            setErrorMessage("");
            try {
                const exists = await checkPatientExistsOnServer(patientIdInput.trim());
                if (!exists) {
                    setErrorMessage("Paciente com este ID não foi encontrado.");
                    setIsLoadingSubmit(false);
                    return;
                }

                const formData = new FormData();
                if (user?.id) {
                    formData.append("userId", user.id);
                } else {
                    throw new Error("ID do usuário indefinido.");
                }
                formData.append("patientId", patientIdInput.trim());

                await createPatient(formData);
                closeModal();

                const updatedPatients = await getMyPatients(user.id);
                setPatients(updatedPatients);
            } catch (error) {
                console.error("Erro ao adicionar paciente:", error);
                setErrorMessage("Erro ao adicionar paciente. Verifique os dados.");
            } finally {
                setIsLoadingSubmit(false);
            }
        } else {
            setErrorMessage("Por favor, insira o ID do paciente.");
        }
    }, [user.id, patientIdInput, closeModal]);

    const handleCardClick = (patientId: string) => {
        router.push(`/my-patient/${patientId}`); // Altere '/rota' para a rota desejada
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Meus Pacientes Associados
            </h1>

            <div className="flex justify-center mb-8">
                <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-colors"
                >
                    <UserPlus className="h-5 w-5" />
                    Adicionar Paciente
                </button>
            </div>

            {isLoadingPatients ? (
                <div className="text-center text-gray-500 mt-12">Carregando pacientes...</div>
            ) : patients.length === 0 ? (
                <div className="text-center text-gray-500 mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                    <p className="text-lg mb-2">Nenhum paciente associado encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map((patient) => (
                        <div
                            key={patient.id}
                            className="bg-white p-6 rounded-lg shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition-shadow"
                            onClick={() => handleCardClick(patient.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") handleCardClick(patient.id);
                            }}
                        >
                            <h2 className="text-xl font-semibold text-blue-700 mb-3">
                                Paciente ID: {patient.id}
                            </h2>
                            <p className="text-gray-700 mb-1">
                                <span className="font-medium">Médico:</span>{" "}
                                {patient.medicalId === user.id ? (
                                    <span className="text-green-600 font-semibold">
                                        Você ({patient.medicalUser?.name || patient.medicalId})
                                    </span>
                                ) : (
                                    patient.medicalUser?.name || patient.medicalId
                                )}
                            </p>
                            <p className="text-gray-700 mb-4">
                                <span className="font-medium">Paciente:</span>{" "}
                                {patient.patientId === user.id ? (
                                    <span className="text-green-600 font-semibold">
                                        Você ({patient.patientUser?.name || patient.patientId})
                                    </span>
                                ) : (
                                    patient.patientUser?.name || patient.patientId
                                )}
                            </p>
                            <p className="text-gray-700 mb-1">
                                <span className="font-medium">Gênero:</span>{" "}
                                {patient.patientUser?.gender || "Não informado"}
                            </p>
                            <p className="text-gray-700 mb-1">
                                <span className="font-medium">Data de Nascimento:</span>{" "}
                                {patient.patientUser?.dateBirth
                                    ? new Date(patient.patientUser.dateBirth).toLocaleDateString(
                                          "pt-BR"
                                      )
                                    : "Não informado"}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                Adicionar Novo Paciente
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        {errorMessage && (
                            <p className="text-red-500 text-sm mb-3 text-center">{errorMessage}</p>
                        )}
                        <div className="mb-4">
                            <label
                                htmlFor="patient-id"
                                className="block text-gray-700 text-sm font-medium mb-2"
                            >
                                ID do Paciente:
                            </label>
                            <input
                                id="patient-id"
                                type="text"
                                value={patientIdInput}
                                onChange={(e) => setPatientIdInput(e.target.value)}
                                onFocus={() => setErrorMessage("")}
                                placeholder="Insira o ID do paciente..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
                                disabled={isLoadingSubmit}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100"
                                disabled={isLoadingSubmit}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                disabled={isLoadingSubmit}
                            >
                                {isLoadingSubmit ? "Verificando..." : "Adicionar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
