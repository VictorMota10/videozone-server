export interface CreateChannelPayload {
    name: string
    imageUrl: string
    description: string
}

export interface ChannelResponseProps {
    id: string
    name: string
    logo_url: string
    description: string
    created_at: string
}

export interface ChannelProps {
    id: string
    name: string
    imageUrl: string
    description: string
    createdAt: string
}