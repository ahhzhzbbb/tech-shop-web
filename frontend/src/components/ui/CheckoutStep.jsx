import { Bag, IdentificationCard, CreditCard, CheckCircle } from "@phosphor-icons/react";
import "./CheckoutStep.scss";

const STEPS = [
  { label: "Giỏ hàng",            icon: Bag },
  { label: "Thông tin đặt hàng",  icon: IdentificationCard },
  { label: "Thanh toán",          icon: CreditCard },
  { label: "Hoàn tất",            icon: CheckCircle },
];

const CheckoutStep = ({ currentStep = 1 }) => {
  return (
    <div className="checkout-steps">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isActive   = stepNumber === currentStep;
        const isDone     = stepNumber < currentStep;
        const Icon       = step.icon;

        return (
          <div key={stepNumber} className="checkout-steps__item">
            {/* Đường kẻ nối (không hiển thị trước step đầu) */}
            {index > 0 && (
              <div className={`checkout-steps__line ${isDone ? "checkout-steps__line--done" : ""}`} />
            )}

            <div className="checkout-steps__node">
              <div className={`checkout-steps__circle
                ${isActive ? "checkout-steps__circle--active" : ""}
                ${isDone   ? "checkout-steps__circle--done"   : ""}
              `}>
                <Icon size={20} weight={isActive || isDone ? "fill" : "regular"} />
              </div>
              <span className={`checkout-steps__label
                ${isActive ? "checkout-steps__label--active" : ""}
                ${isDone   ? "checkout-steps__label--done"   : ""}
              `}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutStep;