interface Props {
	sidebar: React.ReactNode;
	topbar: React.ReactNode;
	children: React.ReactNode;
}

export default function DashboardLayout({ sidebar, topbar, children }: Props) {
	return (
		<div className="flex h-screen font-sans overflow-hidden">
			{sidebar}
			<div className="flex flex-col flex-1 bg-gray-50 overflow-hidden">
				{topbar}
				<main className="flex-1 overflow-y-auto p-5">{children}</main>
			</div>
		</div>
	);
}
