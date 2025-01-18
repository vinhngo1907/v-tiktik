import { FC } from "react"

interface MainProps {
    origin: string
}

const Main: FC<MainProps> = ({ origin }) => {
    return (
        <div className="flex-grow">Home Main Page</div>
    )
}

export default Main;