import { useContext } from "react";
import { SmartPost } from "../../provider/Provider";

const useThinkify = () => {
  return useContext(SmartPost);
};

export default useThinkify;