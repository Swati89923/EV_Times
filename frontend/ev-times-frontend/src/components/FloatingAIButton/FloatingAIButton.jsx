import "./FloatingAIButton.css";

const FloatingAIButton = ({ onClick}) => {
    return (
        <button 
          className="floating-ai-btn"
          onClick={onClick}> 🤖 </button>
    );
};

export default FloatingAIButton;