import { useEffect, useRef } from "react";
import { toast } from "sonner";

const SuccessToast = ({ success, message }) => {
    const shown = useRef(false);

    useEffect(() => {
        if (!success) {
            shown.current = false;
            return;
        }

        if (!shown.current) {
            shown.current = true;
            toast.success(message);
        }
    }, [success, message]);

    return null;
};

export default SuccessToast;
