import React from "react";

const TreeView = ({data}: {data: { [id: string]: string[] }}) => {

	return <ul>
		{
			Object.keys(data).map(section => (
				<li>
					{section}
					<ul>
						{
							data[section].map(item => (
								<li>{item}</li>
							))
						}
					</ul>
				</li>
			))
		}
	</ul>


}
export {TreeView}