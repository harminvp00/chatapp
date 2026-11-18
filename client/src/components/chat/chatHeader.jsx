
import test_profile_img from '../../assets/dummy/test3.jpeg'

import { CloseSVG } from '../../assets/svgs/SVGs.jsx';

export function ChatHeader() {
    
    return (
        <header className='flex items-center gap-3 p-3 bg-[#f5f5f5] '>
            
            <CloseSVG fill={"#000"} />

            <img className='w-8 h-8 rounded-full' src={test_profile_img} alt="" />

            <span> receivers_name </span>

            <span> receivers_status</span>
            <div className='flex-1 flex justify-end'>
                <span> settings </span>
            </div>
        </header>
    )
}