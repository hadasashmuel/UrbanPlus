using AutoMapper;
using DAL.Entities;
using DTO.BadgeDTO;
using DTO.CategoryDTO;
using DTO.MainEventDTO;
using DTO.MessageDTO;
using DTO.NotificationDTO;
using DTO.ReportDTO;
using DTO.ReportImageDTO;
using DTO.SaveEventDTO;
using DTO.UserBadgeDTO;
using DTO.UserDTO;
using DTO.VoteDTO;

namespace BLL
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Users
            CreateMap<Users, ProfileUserDTO>()
                .ForMember(dest => dest.ProfilePicture,
                    opt => opt.Ignore())
                .ReverseMap();

            CreateMap<Users, ShortProfileUserDTO>();

            CreateMap<CreateUserDTO, Users>()
                .ForMember(dest => dest.ProfilePicture,
                    opt => opt.Ignore());

            CreateMap<UpdateUserDTO, Users>()
                .ForMember(dest => dest.UserId,
                    opt => opt.Ignore())
                .ForMember(dest => dest.ProfilePicture,
                    opt => opt.Ignore());

            // Categories
            CreateMap<Categories, ShowCategoryDTO>();
            CreateMap<CreateCategoryDTO, Categories>();

            // Badges
            CreateMap<Badges, ShowBadgeDTO>();
            CreateMap<CreateBadgeDTO, Badges>();

            // Main Events
            CreateMap<MainEvents, ShortShowMainEventDTO>()
                .ForMember(dest => dest.CategoryName,
                    opt => opt.MapFrom(src =>
                        src.Category != null
                            ? src.Category.CategoryName
                            : null))
                .ForMember(dest => dest.CountVotes,
                    opt => opt.MapFrom(src => src.Votes.Count));

            CreateMap<MainEvents, ShowMainEventDTO>()
                .ForMember(dest => dest.CategoryName,
                    opt => opt.MapFrom(src =>
                        src.Category != null
                            ? src.Category.CategoryName
                            : null))
                .ForMember(dest => dest.CountVotes,
                    opt => opt.MapFrom(src => src.Votes.Count))
                .ForMember(dest => dest.CountSavedEvents,
                    opt => opt.MapFrom(src => src.SavedEvents.Count))
                .ForMember(dest => dest.CountReports,
                    opt => opt.MapFrom(src => src.Reports.Count));

            // Reports
            CreateMap<Reports, ShowReportDTO>()
     .ForMember(dest => dest.CategoryName,
         opt => opt.MapFrom(src =>
             src.Category != null
                 ? src.Category.CategoryName
                 : null))
     .ForMember(dest => dest.ImageList,
         opt => opt.MapFrom(src => src.Images));

            CreateMap<ReportImages, ShowReportImageDTO>();

            CreateMap<CreateReportImageDTO, ReportImages>()
                .ForMember(dest => dest.ReportImageId,
                    opt => opt.Ignore())
                .ForMember(dest => dest.ReportId,
                    opt => opt.Ignore());


            // Votes
            CreateMap<Votes, ShowVoteDTO>();
            CreateMap<CreateVoteDTO, Votes>();

            // Saved Events
            CreateMap<SavedEvents, ShowSavedEventsDTO>();
            CreateMap<CreateSaveEventDTO, SavedEvents>();

            // Messages
            CreateMap<Message, ShowMessageDTO>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src =>
                        src.User != null
                            ? src.User.FirstName + " " + src.User.LastName
                            : null));

            CreateMap<CreateMessageDTO, Message>();

            // Notifications
            CreateMap<Notifications, ShowNotificationDTO>()
                .ForMember(dest => dest.TitleMainEvent,
                    opt => opt.MapFrom(src =>
                        src.MainEvent != null
                            ? src.MainEvent.Title
                            : null));

            // User Badges
            CreateMap<UserBadges, ShowUserBadgeDTO>()
                .ForMember(dest => dest.Name,
                    opt => opt.MapFrom(src =>
                        src.Badge != null
                            ? src.Badge.BadgeName
                            : null))
                .ForMember(dest => dest.Description,
                    opt => opt.MapFrom(src =>
                        src.Badge != null
                            ? src.Badge.Description
                            : null))
                .ForMember(dest => dest.Icon,
                    opt => opt.MapFrom(src =>
                        src.Badge != null
                            ? src.Badge.IconUrl
                            : null));

            CreateMap<UserBadges, ShowBadgeDTO>()
                .ForMember(dest => dest.BadgeId,
                    opt => opt.MapFrom(src => src.BadgeId))
                .ForMember(dest => dest.BadgeName,
                    opt => opt.MapFrom(src =>
                        src.Badge != null
                            ? src.Badge.BadgeName
                            : null))
                .ForMember(dest => dest.Description,
                    opt => opt.MapFrom(src =>
                        src.Badge != null
                            ? src.Badge.Description
                            : null))
                .ForMember(dest => dest.IconUrl,
                    opt => opt.MapFrom(src =>
                        src.Badge != null
                            ? src.Badge.IconUrl
                            : null));
        }
    }
}
