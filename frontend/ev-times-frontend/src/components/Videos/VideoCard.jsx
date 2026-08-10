import { FaPlay, FaEye, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import "./VideoSection.css";

const VideoCard = ({ video }) => {
  return (
    <motion.div
      className="video-card"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="video-thumbnail">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
        />

        <div
          className="video-overlay"
          onClick={() =>
            window.open(video.youtubeUrl, "_blank")
          }
        >
          <FaPlay className="play-icon" />
        </div>

        <span className="video-duration">
          {video.duration}
        </span>
      </div>

      <div className="video-content">
        <span className="video-category">
          {video.category}
        </span>

        <h3>{video.title}</h3>

        <div className="video-meta">
          <span>
            <FaEye /> {video.views}
          </span>

          <span>
            <FaClock /> {video.createdAt?.substring(0, 10)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCard;