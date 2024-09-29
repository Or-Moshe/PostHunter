  /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: helper for general functions
  */

const helper = {
    /*
    Author: Or Moshe
    Since: 20/12/23
    Descrption: get base64 from url
    */
    get_base64_from_url: async (url) => {
        const data = await fetch(url);
        if (!data.ok) {
            throw new Error(`Failed to fetch. Status: ${data.status} ${data.statusText}`);
        }
        const blob = await data.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob); 
            reader.onloadend = () => {
                const base64data = reader.result;   
                resolve(base64data);
            };
        
            reader.onerror = (error) => {
                reject(new Error(`Error reading file: ${error.message}`));
            };
        });
  },

  get_binary_string_from_url: async (url) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
          throw new Error(`Failed to fetch. Status: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return new Promise((resolve, reject) => {
        helper.arrayBuffer_to_binary_string(arrayBuffer)
        .then((binaryString) => {
          resolve(binaryString);
        })
        .catch((error) => {
          reject(error);
        });
      });
  } catch (error) {
      console.error('Error:', error);
  }
},

  /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: extractDataFromBlobUrl
  */
  extractDataFromBlobUrl: async (blobUrl) => {
    try {
        // Fetch the Blob content
        const response = await fetch(blobUrl);
  
        if (!response.ok) {
            throw new Error(`Failed to fetch. Status: ${response.status} ${response.statusText}`);
        }
  
        const blob = await response.blob();
  
        // Read the Blob data using FileReader
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const data = reader.result;
                resolve(data);
            };
            reader.readAsText(blob); // You can use readAsArrayBuffer, readAsDataURL, etc. based on your needs
        });
    } catch (error) {
        //console.log('Error extracting data from Blob:', error);
        throw error;
    }
  },

    /*
  Author: Or Moshe
  Since: 20/12/23
  Descrption: copy comment toclipboard
  */
  copy_to_clipboard: (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
        //closeToast(1500);
      })
      .catch((error) => {
        console.log("Error copying text: ", error);
      });
  },
  
  handle_error: (error) => {
    console.log(error);
  },

  arrayBuffer_to_binary_string: async (arrayBuffer) => {
    return new Promise((resolve) => {
      const binaryArray = new Uint8Array(arrayBuffer);
      let binaryString = '';

      // Convert each byte to binary representation
      for (let i = 0; i < binaryArray.length; i++) {
          binaryString += binaryArray[i].toString(2).padStart(8, '0');
      }

      resolve(binaryString);
    });
}

}