"use client"
import { useParams } from "next/navigation";

export default function TablatureId()
{
	const params=useParams();
	const tablatureid=params.tablatureid;
	return (
		<div className="bg-[#f5f5dc] min-h-screen py-10 px-4 md:px-12 relative max-h-screen overflow-y-auto">
			<p className="text-center text-blue-900">{tablatureid}</p>
		</div>
	);
}
