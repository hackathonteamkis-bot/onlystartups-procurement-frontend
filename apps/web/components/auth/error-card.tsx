import { CardWrapper } from "./card-wrapper";
import { BsExclamationTriangle } from "react-icons/bs";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex flex-col justify-center items-center py-4 space-y-3">
        <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
          <BsExclamationTriangle className="text-red-500 w-7 h-7" />
        </div>
        <p className="text-[#1A1A2E]/60 text-[13px] sm:text-sm font-medium text-center max-w-[280px]">
          We encountered an error while processing your request.
        </p>
      </div>
    </CardWrapper>
  );
};
