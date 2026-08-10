import { useEffect, useState } from "react";
import API from "../../services/api";
import BlogCard from "./BlogCard";
import FeaturedBlog from "./FeaturedBlog";
import "./BlogSection.css";

const BlogSection = () => {

    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {

        try {

            const response = await API.get("/blogs");

            console.log(response.data);

            setBlogs(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchBlogs();

    }, []);

    return (

        <section className="blog-section">

            <div className="blog-header">

                <h2>📝 EV Insights & Blogs</h2>

                <p>Buying Guides • Charging • Technology • EV Tips</p>

            </div>

            <div className="blog-layout">

                {/* LEFT SIDE */}

                <div className="featured-blog">

                    {

                        blogs.length > 0 &&

                        <div
                            className="featured-blog-wrapper"
                            onClick={() => window.open(blogs[0].sourceUrl, "_blank")}
                        >
                            <FeaturedBlog blog={blogs[0]} />
                        </div>

                    }

                    {/* Two Blogs Below Featured */}

                    <div className="bottom-blog-grid">

                        {

                            blogs.slice(1, 3).map((blog) => (

                                <div
                                    key={blog.id}
                                    onClick={() => window.open(blog.sourceUrl, "_blank")}
                                >
                                    <BlogCard blog={blog} />
                                </div>

                            ))

                        }

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="blog-sidebar">

                    <h3 className="sidebar-title">

                        Latest Blogs

                    </h3>

                    <div className="blog-list">

                        {

                            blogs.slice(3).map((blog) => (

                                <div
                                    key={blog.id}
                                    className="sidebar-blog"
                                    onClick={() => window.open(blog.sourceUrl, "_blank")}
                                >
                                    <BlogCard blog={blog} />
                                </div>

                            ))

                        }

                    </div>

                </div>

            </div>

        </section>

    );

};

export default BlogSection;