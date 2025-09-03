import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedUser, setselectedUser }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : " "
      }`}
    >
      <div className="pb-5">
        <div className="flex items-center justify-between">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative group py-2">
            <img
              src={assets.menu_icon}
              alt="menu"
              className="max-h-5 cursor-pointer"
            />

            <div
              className="w-fit absolute top-full right-0 z-20 rounded-md bg-[#282142] 
                  border border-gray-500 p-5 hidden group-hover:block"
            >
              <p
                onClick={() => navigate("/")}
                className="text-sm cursor-pointer whitespace-nowrap"
              >
                Edit Profile
              </p>
              <hr className="my-2 border border-gray-500" />
              <p className="text-sm cursor-pointer">Logout</p>
            </div>
          </div>
        </div>

        <div className="bg-[#282142] py-3 px-4 mt-5 rounded-full flex items-center gap-2 text-[#c8c8c8]">
            <img src={assets.search_icon} alt="search" className="w-3"/>
            <input type="text" className="bg-transparent outline-none border-none text-white text-xs placeholder-[#c8c8c8] flex-1" 
            placeholder="Search User..."/>
        </div>

      </div>

      <div className="flex flex-col">
        {userDummyData.map((user,index)=>(
            <div key={index} onClick={() => setselectedUser(user)}
            className={`relative flex items-center gap-2 p-2 pl-4 cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && "bg-[#282142]/50"}`}>
                <img src={user?.profilePic || assets.avatar_icon} alt="avatar"  className="w-[35px] aspect-square rounded-full"/>
                <div className="flex flex-col leading-5">
                    <p>{user.fullName}</p>
                    {
                        index < 3 
                        ?
                        <span className="text-green-400 text-xs">Online</span>
                        :
                        <span className="text-neutral-400 text-xs">Offline</span>
                    }
                </div>

                {
                    index > 2 && <p className="absolute top-4 right-4 text-xs h-5 w-5 flex items-center justify-center rounded-full bg-violet-500/50">{index}</p>
                }
            </div>
        ))} 
    </div>    
    </div>
  );
};

export default Sidebar;
