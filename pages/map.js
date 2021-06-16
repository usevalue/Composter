import Head from 'next/head'
import dynamic from 'next/dynamic'

export default function MapPage() {
    const WebMap = dynamic(() => import("../component/planningmap"), {
        ssr: false
      });

    return (
    <div>
        <Head>
            <title>Regrowth</title>
            <link rel="icon" href="/images/stockseed.ico" />
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
                integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                crossOrigin="" />
            <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossOrigin="anonymous"></script>
        </Head>
        
        <WebMap />
    </div>
    );
}