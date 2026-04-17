import Link from 'next/link';
import styles from './topmenu.module.css';
import TopMenuAuth from './TopMenuAuth';
import Image from 'next/image';

export default function TopMenu() {
    return (
        <nav className={styles.nav}>
            <Link href="/" className={`${styles.logo} flex items-center gap-2`}>
                <Image
                src="/img/benecon.jpg"
                alt="Logo"
                width={0}
                height={0}
                sizes="120vw"
                className="h-10 w-auto object-contain rounded-lg"
                />
                Fontyard
            </Link>
            <TopMenuAuth />
        </nav>
    );
}
