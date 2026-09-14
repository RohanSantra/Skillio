import { useEffect, useRef } from "react";
import { toast } from "sonner";

const ErrorToast = ({ error }) => {
    const lastError = useRef(null);

    useEffect(() => {
        if (!error || error === lastError.current) {
            return;
        }

        lastError.current = error;
        toast.error(error);
    }, [error]);

    return null;
};

export default ErrorToast;
