"use client"
import { Car } from '@/app/interfaces/datatypes'
import { LatLng } from 'leaflet';
import dynamic from 'next/dynamic';
import React, { useEffect, useMemo, useRef, useState } from 'react'

interface CarDisplayTableItemProps {
    item: Car;
}

const CarDisplayTableItem: React.FC<CarDisplayTableItemProps> = ({ item }) => {

    const [showDetail, setShowDetail] = useState(false)

    const ref = useRef<HTMLDivElement>(null)

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setShowDetail(false);
        }
    }

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside)
    
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])
    

    const Map = useMemo(() => dynamic(
        () => import('@/app/components/general/map'),
        {
            loading: () => <p>Loading map...</p>,
            ssr: false
        }
    ), [])

    return (
        <div
            ref={ref}
            className={`${showDetail ? 'z-10 shadow-[0_0_50px_50px_rgba(0,0,0,0.4)]' : ''} rounded-2xl bg-white text-black flex flex-col w-full p-4 gap-2 hover:text-white hover:bg-[#1C0F13] hover:cursor-pointer transition-all`}
            onClick={() => setShowDetail(true)}>
            {showDetail && <div className="flex py-2 text-sm font-normal text-gray-500">
                <div className="basis-1/5">Make</div>
                <div className="basis-1/5">Model</div>
                <div className="basis-1/5">Colour</div>
                <div className="basis-1/5">Location</div>
                <div className="basis-1/5">Price</div>
            </div>}
            <div className="flex text-md font-normal">
                <div className="basis-1/5 items-center">{item.make}</div>
                <div className="basis-1/5">{item.model}</div>
                <div className="basis-1/5">{item.colour}</div>
                <div className="basis-1/5">{`${item.city}, ${item.country}`}</div>
                <div className="basis-1/5">$ {item.price}</div>
            </div>
            {showDetail && <div className="flex py-2 justify-between text-sm font-normal text-gray-500">
                <div className="basis-1/5">Status</div>
                <div className="basis-1/5">Top Speed</div>
            </div>}
            {showDetail &&
                <div className="flex text-md font-bold justify-between">
                    <div className="basis-1/5">{item.new ? "New" : "Used"}</div>
                    <div className="basis-1/5">{item.topSpeed} km/h</div>
                </div>}
            {showDetail && <div className='w-full h-[500px]'>
                <Map position={new LatLng(item.dealerLatitude, item.dealerLongitude)} zoom={18} />
            </div>}
        </div>
    )
}

export default CarDisplayTableItem