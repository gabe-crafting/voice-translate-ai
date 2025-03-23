import Link from 'next/link';

const Header = () => {
    return (
        <ul className="header-container">
            <Link href="/">
                <li>en-ro-detailed</li>
            </Link>
            <Link href="/full">
                <li>en-ro</li>
            </Link>
            <Link href="/ro-en">
                <li>ro-en</li>
            </Link>
            <Link href="/posthelper">
                <li>Post helper</li>
            </Link>
        </ul>
    )
}

export default Header