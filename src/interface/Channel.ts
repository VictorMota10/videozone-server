import { VideoResponseProps } from "./Video";

export interface CreateChannelPayload {
  name: string;
  imageUrl: string;
  description: string;
  tagName: string;
}

export interface ChannelProps {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export interface ManagmentChannelResponseProps {
  channelData: ChannelData | undefined;
  videos: VideoResponseProps[] | undefined;
}

export interface ChannelData {
  id: string;
  tag_name: string;
  name: string;
  logo_url: string;
  description: string;
  created_at: string;
  followers: any;
}

export interface ManagmentDashboardData {
  countViews: number;
  countLikes: number;
  countDislikes: number;
  countVideos: number;
}
