interface Props {
	address: string;
}

export default function GoogleMapEmbed({ address }: Props) {
	return (
		<iframe
			width="100%"
			height="450"
			style={{ border: 0 }}
			loading="lazy"
			allowFullScreen
			referrerPolicy="no-referrer-when-downgrade"
			src={`https://www.google.com/maps/embed/v1/place?key=${
				process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
			}&q=${encodeURIComponent(address)}`}
		/>
	);
}
