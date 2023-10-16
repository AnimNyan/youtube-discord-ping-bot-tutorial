module.exports = (formatType, stringArray, everyoneRoleID = "-1") => {
    //initialised
    let formattedString = "";
    
    //----------------------------Discord Channel String Formatting------------------------------
    if (formatType === "channel")
    {
        let channelIDsString = "";
        //"1231242323" -> "<#1231242323>" -> "<#1231242323> <#122352352342>" 
        for (tempChannelIDString of stringArray)
        {
            tempChannelIDString = `<#${tempChannelIDString}> `;
            channelIDsString = channelIDsString + tempChannelIDString;
        }

        formattedString = channelIDsString;
    }

    //----------------------------Discord Role String Formatting------------------------------
    else if (formatType === "role")
    {
        //console.log(`everyoneRoleID:${everyoneRoleID}`);

        let roleIDsString = "";
        //"1231242323" -> "<@&1231242323>" -> "<@&1231242323> <@&122352352342>" 
        for (tempRoleIDString of stringArray)
        {
            //handle the @everyone formatting use case
            //if a @everyone Role ID is not specified
            //then operate like normal for role string formatting for Discord
            if (everyoneRoleID === "-1")
            {
                tempRoleIDString = `<@&${tempRoleIDString}> `;
            }
            
            //if we have specified a @everyone Role ID
            //AND the current tempRoleIDString matches the @everyone Role ID 
            //then we want to change the tempRoleIDString to "@everyone"
            else
            {
                //console.log(`tempRoleIDString:${tempRoleIDString} === everyoneRoleID:${everyoneRoleID}`);
                if (tempRoleIDString === everyoneRoleID)
                {
                    tempRoleIDString = "@everyone";
                }
                //otherwise handle like it is a normal role formatting
                //with <@&>
                else
                {
                    tempRoleIDString = `<@&${tempRoleIDString}> `;
                }
            }
            
            
            roleIDsString = roleIDsString + tempRoleIDString;
        }

        formattedString = roleIDsString;
    }

    else 
    {
        formattedString = "invalid";
        throw new Error(`Invalid formatType: ${formatType}`);
    }


    return formattedString;
}