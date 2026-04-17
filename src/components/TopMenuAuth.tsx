'use client'

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './topmenu.module.css';

export default function TopMenuAuth() {
    const { data: session, status } = useSession();
    const isAdmin = session?.user.role === 'admin' || session?.user.role === 'PomPhet';

    if (status === 'loading') {
        return (
            <>
                <div className={styles.navLinks}>
                    <Link href="/hotel" className={styles.navLink}>รายชื่อโรงแรม</Link>
                </div>
                <div style={{ width: 180 }} />
            </>
        );
    }

    if (!session) {
        return (
            <>
                <div className={styles.navLinks}>
                    <Link href="/hotel" className={styles.navLink}>รายชื่อโรงแรม</Link>
                </div>
                <div className={styles.authSection}>
                    <Link href="/auth/signin" className={styles.signInBtn}>เข้าสู่ระบบ</Link>
                    <Link href="/auth/register" className={styles.signUpBtn}>สมัครสมาชิก</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <div className={styles.navLinks}>
                <Link href="/hotel" className={styles.navLink}>รายชื่อโรงแรม</Link>
                <Link href="/mybooking" className={styles.navLink}>การจองของฉัน</Link>
                {session?.user.role === 'PomPhet' && (
                    <Link href="/admin/users" className={styles.navLink}>การจัดการ</Link>
                )}
                {session?.user.role === 'admin' && (
                    <Link href="/admin/dashboard" className={styles.navLink}>การจัดการ</Link>
                )}
            </div>
            <div className={styles.authSection}>
                <div className={styles.userMenu}>
                    <div className={styles.userBtn}>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{session.user.name}</span>
                            <span className={styles.userRole}>{session.user.role === 'PomPhet' ? 'PomPhet' : isAdmin ? 'แอดมิน' : 'ผู้ใช้'}</span>
                        </div>
                        <span style={{ fontSize: 11 }}>▾</span>
                    </div>
                    <div className={styles.dropdown}>
                        <Link href="/my/profile" className={styles.dropdownItem}>โปรไฟล์</Link>
                        <div className={styles.dropdownDivider} />
                        <Link href="/auth/signout" className={styles.dropdownItem}>ออกจากระบบ</Link>
                    </div>
                </div>
                <Link href="/auth/signout" className={styles.logoutBtn}>
                    ออกจากระบบ
                </Link>
            </div>
        </>
    );
}
