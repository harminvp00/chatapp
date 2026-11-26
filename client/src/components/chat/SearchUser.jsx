import { useDashboard } from "../../context/DashboardContext";



export const SearchUser = () => {

    const { swUsername, setSWUsername, handleFetchUserList } = useDashboard();

    function handleSetSWUsername(event) {
        setSWUsername(event.target.value);
    }

    return (
        <div className='w-full bg-blue-500 shadow pb-2'>

            <div className="flex items-center bg-white rounded-xl mx-2 px-2">
                {/* input element that takes username */}
                <input
                    type="text"
                    placeholder='Search User by name'
                    className='flex-1 px-2 py-1 outline-0'
                    value={swUsername}
                    onChange={(event) => handleSetSWUsername(event)}
                />

                <button className='p-2 rounded-full hover:cursor-pointer' onClick={handleFetchUserList}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="32px" width="32px" fill="#000"><path d="M19.6,21l-6.3-6.3q-0.75,0.6-1.72,0.95T9.5,16q-2.72,0-4.61-1.89Q3,12.23 3,9.5Q3,6.77 4.89,4.89T9.5,3t4.61,1.89T16,9.5q0,1.1-0.35,2.07T14.7,13.3L21,19.6L19.6,21ZM9.5,14q1.88,0 3.19-1.31T14,9.5T12.69,6.31T9.5,5T6.31,6.31T5,9.5t1.31,3.19T9.5,14Z" /></svg>
                </button>
            </div>
        </div>
    )
}