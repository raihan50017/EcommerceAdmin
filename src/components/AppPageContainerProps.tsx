/* eslint-disable @typescript-eslint/no-explicit-any */
interface AppPageContainerProps {
    children?: React.ReactNode;
}

export default function AppPageContainer({ children }: AppPageContainerProps) {
    return <div className="bg-white w-full rounded-md p-3">{children}</div>;
}