import "./VideoModal.css";

const VideoModal = ({ video, onClose }) => {

    if (!video) return null;

    const embedUrl = video.youtubeUrl.replace(
        "watch?v=",
        "embed/"
    );

    return (
        <div className="video-modal-overlay" onClick={onClose}>

            <div
                className="video-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ✕
                </button>

                <iframe
                    width="100%"
                    height="500"
                    src={embedUrl}
                    title={video.title}
                    allowFullScreen
                ></iframe>

            </div>

        </div>
    );
};

export default VideoModal;