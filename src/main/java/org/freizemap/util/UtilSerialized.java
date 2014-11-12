package org.freizemap.util;

import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.List;

import org.apache.log4j.Logger;
import org.freizemap.service.bean.EventFM;
import org.freizemap.service.bean.base.FMBean;

public class UtilSerialized {
	private final static Logger LOG = Logger.getLogger(UtilSerialized.class);

	public static <T extends EventFM> void serialized(final String fileName,
			List<T> listeFMBean) {
		try {
			FileOutputStream out = new FileOutputStream(fileName);
			ObjectOutputStream oos = new ObjectOutputStream(out);
			oos.writeObject(listeFMBean);
			oos.flush();
			oos.close();
		} catch (Exception e) {
			LOG.error("Problem serializing: " + e);
		}
	}

	public static <T extends EventFM> List<T> deserialized(
			final InputStream input) {
		List<T> listeObjects = null;
		try {

			ObjectInputStream ois = new ObjectInputStream(input);
			listeObjects = (List<T>) (ois.readObject());
			ois.close();
		} catch (Exception e) {
			LOG.error("Problem serializing: " + e, e);
		}

		return listeObjects;
	}
}
