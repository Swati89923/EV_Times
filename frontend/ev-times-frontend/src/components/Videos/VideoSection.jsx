import { useEffect, useState } from "react";
import API from "../../services/api";

import VideoCard from "./VideoCard";
import "./VideoSection.css";
import VideoModal from "./VideoModal";

const VideoSection = () => {

    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const fetchVideos = async () => {
        try {
            const response = await API.get("/videos");

            console.log("Videos API:", response.data);

            setVideos(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    return (
        <section className="video-section">

            <div className="video-header">

                <div>
                    <h2>🎥 Latest EV Videos</h2>
                    <p>Reviews • Charging • Battery • Technology</p>
                </div>

                <button className="view-all-btn">
                    View All →
                </button>

            </div>

            {/* Video Grid */}

            <div className="video-grid">

                {videos.map((video) => (

                    <div
                        key={video.id}
                        onClick={() => setSelectedVideo(video)}
                    >
                        <VideoCard video={video} />
                    </div>

                ))}

            </div>

            <VideoModal
                video={selectedVideo}
                onClose={() => setSelectedVideo(null)}
            />

        </section>
    );
};

export default VideoSection;