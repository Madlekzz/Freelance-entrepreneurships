import { message } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  approveAccessRequest,
  getPendingRequests,
  rejectAccessRequest,
  type SignupRequest,
} from "../services/authService";

export const useSignupRequests = () => {
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveAccessRequest(id);
      const successMsg = "Solicitud aprobada con éxito";
      toast.success(successMsg);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error al aprobar";
      message.error(errorMsg);
      toast.error(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const closeRejectModal = () => {
    if (!isRejecting) {
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedId) return;
    setIsRejecting(true);
    try {
      await rejectAccessRequest(selectedId);
      setRequests((prev) => prev.filter((r) => r.id !== selectedId));
      setIsModalOpen(false);
      toast.success("Solicitud rechazada exitosamente");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error al rechazar";
      toast.error(errorMsg);
    } finally {
      setIsRejecting(false);
      setSelectedId(null);
    }
  };

  return {
    requests,
    loading,
    processingId,
    isRejecting,
    isModalOpen,
    isInitialLoading: loading && requests.length === 0,
    handleApprove,
    openRejectModal,
    closeRejectModal,
    handleConfirmReject,
  };
};
