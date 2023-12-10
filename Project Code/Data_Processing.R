library(httr)
library(tidyverse)
library(readr)
library(leaflet)
# API URL
url <- "https://gbfs.lyft.com/gbfs/2.3/bkn/en/station_information.json"

# Sending a GET request to the API
response <- GET(url)

# Checking the status of the response
if (status_code(response) == 200) {
  # Parsing the content of the response to a list
  api_data <- content(response, "parsed")
} else {
  cat("Failed to retrieve data: HTTP status", status_code(response), "\n")
}

station_raw <- api_data$data$stations
# Transforming the nested list into a dataframe
databike_raw <- map_dfr(station_raw, ~flatten_df(as.data.frame(.x)))

station_dict <- subset(databike_raw, select = c("name", "lat", "lon", "capacity"))
databike <-station_dict

write.csv(databike, "/Users/dehaay/Desktop/BikeShare Project/output/edav_station_dict", row.names = FALSE)


##### Data Merge ####
# Read the CSV files

df1 <- read_csv("/Users/dehaay/Desktop/BikeShare Project/output/post_22_04end_station_count_all.csv")
df2 <- read_csv("/Users/dehaay/Desktop/BikeShare Project/output/raw_End_station_count_all.csv")

# Identify missing columns in both dataframes
active_stations <- databike$name

#Stations names that stayed same since 2013
common_stations_eversince <- Reduce(intersect, list(colnames(df1), active_stations,colnames(df2)))
common_stations_eversince <- c("year" ,"month" , "day" , "hour_interval",common_stations_eversince)
#Station names that are here for the last 1.5 years
common_stations_lastyear <- intersect(colnames(df1), active_stations)
common_stations_lastyear <- c("year" ,"month" , "day" , "hour_interval",common_stations_lastyear)


### Create the Data Frames
recent_data <- df1 %>% select(all_of(common_stations_lastyear))

df1_selected <- df1 %>% select(all_of(common_stations_eversince))
df2_selected <- df2 %>% select(all_of(common_stations_eversince))
history_data <- bind_rows(df1_selected, df2_selected)



#---------------Fix the Date on the Data Frames------------------------#

recent_data$datetime <- paste(recent_data$year, recent_data$month, recent_data$day,
                     sprintf("%02d:00:00", recent_data$hour_interval))
# Convert the combined string to a date-time object
recent_data$datetime <- as.POSIXct(recent_data$datetime, format = "%Y %m %d %H:%M:%S")
# Move datetime to the first column and remove the original date columns
recent_data <- recent_data %>%
  select(datetime, dplyr::everything()) %>%
  select(-year, -month, -day, -hour_interval)


history_data$datetime <- paste(history_data$year, history_data$month, history_data$day,
                               sprintf("%02d:00:00", history_data$hour_interval))

# Convert the combined string to a date-time object
history_data$datetime <- as.POSIXct(history_data$datetime, format = "%Y %m %d %H:%M:%S")
# Move datetime to the first column and remove the original date columns
history_data <- history_data %>%
  select(datetime, dplyr::everything()) %>%
  select(-year, -month, -day, -hour_interval)



# Specify the file paths for the CSV files
history_file_path <- "/Users/dehaay/Desktop/EDAV PROJECT/history_data.csv"
recent_file_path <- "/Users/dehaay/Desktop/EDAV PROJECT/recent_data.csv"

# Write history_data to a CSV file using fwrite
fwrite(history_data, file = history_file_path)

# Write recent_data to a CSV file using fwrite
fwrite(recent_data, file = recent_file_path)




#---------------Attach Flow Averages------------------------#
# Function to calculate mean of non-zero values
mean_non_zero <- function(x) {
  non_zero_values <- x[x != 0]
  if (length(non_zero_values) > 0) {
    return(mean(non_zero_values))
  } else {
    return(NA)  # Return NA if all values are zero
  }
}




#Filtering the station names with the existing stations at the time and attaching average station in-flow values
station_dict_recent<- station_dict %>%
  filter(name %in% common_stations_lastyear)

#Filtering the station names with the existing stations at the time and attaching average station in-flow values
station_dict_history <- station_dict %>%
  filter(name %in% common_stations_eversince)

#column_means_vector <- data.frame(sapply(history_data[-1], mean, na.rm = TRUE))
# Apply the function to each column
average_non_zero_per_column <- data.frame(sapply(history_data[-1], mean_non_zero))

mean_df <- data.frame( name = rownames(average_non_zero_per_column), mean_value = average_non_zero_per_column,
                       stringsAsFactors = FALSE)

station_dict_history <- merge(station_dict_history, mean_df, by = "name")
colnames(station_dict_history)[5] <- "average"


#Stations that are added after the historic data
newly_added_stations <- setdiff(station_dict_recent,station_dict_history)







