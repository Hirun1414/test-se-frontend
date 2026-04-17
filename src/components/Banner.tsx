'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './banner.module.css';

const covers = ['/img/cover.jpg', '/img/cover2.jpg', '/img/cover3.jpg', '/img/cover4.jpg'];

export default function Banner() {
    const [index, setIndex] = useState(0);
    const router = useRouter();

    const current = index % covers.length;

    return (
        <div className={styles.banner} onClick={() => setIndex(index + 1)}>
            <div key={current} className={styles.imageWrap}>
                <Image
                    src={covers[current]}
                    alt="Hotel cover"
                    fill
                    priority
                    style={{ objectFit: 'cover' }}
                />
            </div>
            <div className={styles.overlay} />
            <div className={styles.content}>
                <h1 className={styles.title}>
                    จองที่พักในฝัน<br />เริ่มต้นที่ Fontyard
                </h1>
                <p className={styles.subtitle}>
                    ค้นหาและจองโรงแรมที่ใช่ได้ง่ายๆ ไม่ว่าจะเป็นการพักผ่อน งานแต่งงาน หรือการเดินทางธุรกิจ
                </p>
                <button
                    className={styles.ctaBtn}
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push('/hotel');
                    }}
                >
                    ค้นหาโรงแรม
                </button>
            </div>
            <div className={styles.indicators}>
                {covers.map((_, i) => (
                    <button
                        key={i}
                        className={i === current ? styles.dotActive : styles.dot}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIndex(i);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
