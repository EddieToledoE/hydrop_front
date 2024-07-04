import Image from 'next/image'
import LoginPage from './log/page';
import styles from './page.module.css'
import {connectToDatabase} from '@/lib/db'
export default function Home() {
  connectToDatabase();
  return (
    <div className={styles.container}>
     <LoginPage />
    </div>
  )
}
