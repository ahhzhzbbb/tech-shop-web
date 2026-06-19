import React, { useRef, useState, useEffect } from 'react';
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './ProductGallery.scss';

const ProductGallery = ({ images = [] }) => {
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 150);
        return () => clearTimeout(timer);
    }, [images]);

    const handleBeforeChange = (from, to) => {
        setCurrentIndex(to);
    };

    const goTo = (index) => {
        carouselRef.current?.goTo(index, false);
    };

    const next = () => {
        carouselRef.current?.next();
    };

    const prev = () => {
        carouselRef.current?.prev();
    };

    if (!images || images.length === 0) {
        // Fallback images for testing if no props provided
        images = [
            "https://via.placeholder.com/800x600?text=Product+1",
            "https://via.placeholder.com/800x600?text=Product+2",
            "https://via.placeholder.com/800x600?text=Product+3",
            "https://via.placeholder.com/800x600?text=Product+4",
            "https://via.placeholder.com/800x600?text=Product+5"
        ];
    }

    return (
        <div className="product-gallery">
            <div className="product-gallery__main">
                <div className="product-gallery__arrow product-gallery__arrow--left" onClick={prev}>
                    <LeftOutlined />
                </div>
                
                <Carousel 
                    ref={carouselRef} 
                    dots={false} 
                    beforeChange={handleBeforeChange}
                    effect="scrollx"
                >
                    {images.map((img, idx) => (
                        <div key={idx} className="product-gallery__slide">
                            <div className="product-gallery__image-container">
                                <img src={img} alt={`Product ${idx}`} />
                            </div>
                        </div>
                    ))}
                </Carousel>

                <div className="product-gallery__arrow product-gallery__arrow--right" onClick={next}>
                    <RightOutlined />
                </div>
            </div>
            
            <div className="product-gallery__thumbnails">
                {images.map((img, idx) => (
                    <div 
                        key={idx} 
                        className={`product-gallery__thumbnail ${idx === currentIndex ? 'active' : ''}`}
                        onClick={() => goTo(idx)}
                    >
                        <img src={img} alt={`Thumbnail ${idx}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;
