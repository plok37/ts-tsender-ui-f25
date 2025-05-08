import { ConnectButton } from '@rainbow-me/rainbowkit';
import  { FaGithub } from 'react-icons/fa';

export default function Header() {
    return (
        <header className='flex items-center justify-between p-4 bg-blue-100 shadow-md px-8'>
            <div className='flex items-center gap-4'>
                <a
                    href="https://github.com/plok37"
                    target='_blank'
                    rel="noopener noreferrer"
                    className="hover:text-gray-600 transition-colors"
                >
                    <FaGithub size={30} />
                </a>
                <h1 className="text-2xl font-bold text-gray-800">TSender</h1>
                <h3 className="hidden lg:block italic text-center text-zinc-500 mt-2 lg:mt-0 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
                    The most gas efficient airdrop contract on earth, built in huff 🐎
                </h3>
            </div>
            <ConnectButton/>
        </header>
    )
}