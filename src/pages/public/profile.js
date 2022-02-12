import "./profile.css";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";

const Profile = () => {
    const [portfolio, setPortfolio] = useState({ name: "", position: "", bio: "", image: "" });
    const { id } = useParams();
    const loadUserData = async () => {
        setPortfolio({
            name: "John Doe",
            position: "Web developer",
            bio: "I am a full stack web developer with 4 years of experience. I'm proficient in MEAN stack and serverless",
            image: "https://cdn.pixabay.com/photo/2018/04/27/03/50/portrait-3353699_1280.jpg"
        });
        console.log("User profile loaded...");
    }

    useEffect(() => {
        loadUserData();
    }, []);

    return (
        <div className="profile">
            <div className="profile-left">
                <div className="profile-left-wrapper">
                    <h2 className="profile-greet">Hello, My name is</h2>
                    <h1 className="profile-name">{portfolio.name}</h1>
                    <div className="profile-title">
                        <div className="profile-title-wrapper">
                            <div className="profile-title-item">{portfolio.position}</div>
                        </div>
                    </div>
                    <p className="profile-description">
                        {portfolio.bio}
                    </p>
                </div>
            </div>
            <div className="profile-right">
                <div className="profile-bg"></div>
                {portfolio.image ? <img src={portfolio.image} className="profile-img" alt="profile pic" /> : <span/>}
            </div>
        </div>
    )
}

export default Profile
