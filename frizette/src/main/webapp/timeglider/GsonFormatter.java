package timeglider;

import java.util.List;

import org.freizemap.service.json.Events;

import com.google.gson.Gson;

/**
 * Base class to format a {@code List<>} of {@link Events} objects and serialize
 * into JSON-formatted data.
 * 
 * @author Nick Klauer <klauer@gmail.com>
 */
public class GsonFormatter {

	private List<Events> timelines;
	private transient Gson gson = new Gson();
	
	public GsonFormatter(List<Events> timelines) {
		this.timelines = timelines;
	}
	
	public String toJson() {
		return gson.toJson(this);
	}

}
